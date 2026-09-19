use std::fs;
use std::path::Path;
use anyhow::{Context, Result};
use clap::{Parser, Subcommand};
use poppler::PopplerDocument;
use serde::Serialize;
use tesseract::Tesseract;
use image::ImageReader;
use docx::Docx;
use walkdir::WalkDir;

#[derive(Parser)]
#[command(name = "extractor", about = "Document text extractor for RAG ingestion")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Extract text from a single file
    Extract {
        /// Path to the file
        #[arg(short, long)]
        input: String,
        /// Output format (json or text)
        #[arg(short, long, default_value = "json")]
        format: String,
    },
    /// Batch extract all supported files in a directory
    Batch {
        /// Directory to scan
        #[arg(short, long)]
        dir: String,
        /// Output JSON lines to stdout
        #[arg(short, long, default_value = "true")]
        json_lines: bool,
    },
}

#[derive(Serialize)]
struct ExtractionResult {
    filename: String,
    format: String,
    text: String,
    success: bool,
    error: Option<String>,
    page_count: Option<usize>,
    char_count: usize,
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Extract { input, format } => {
            let result = extract_file(&input)?;
            if format == "json" {
                println!("{}", serde_json::to_string(&result)?);
            } else {
                println!("{}", result.text);
            }
        }
        Commands::Batch { dir, json_lines } => {
            for entry in WalkDir::new(&dir).into_iter().filter_map(|e| e.ok()) {
                let path = entry.path();
                if is_supported_format(path) {
                    let result = extract_file(path.to_str().unwrap_or(""))?;
                    if json_lines {
                        println!("{}", serde_json::to_string(&result)?);
                    }
                }
            }
        }
    }
    Ok(())
}

fn is_supported_format(path: &Path) -> bool {
    matches!(
        path.extension().and_then(|e| e.to_str()).unwrap_or("").to_lowercase().as_str(),
        "pdf" | "pptx" | "docx" | "jpg" | "jpeg" | "png" | "tiff" | "bmp"
    )
}

fn extract_file(input: &str) -> Result<ExtractionResult> {
    let path = Path::new(input);
    let filename = path.file_name().unwrap_or_default().to_string_lossy().to_string();
    let format = path.extension().and_then(|e| e.to_str()).unwrap_or("unknown").to_lowercase();

    let text = match format.as_str() {
        "pdf" => extract_pdf(path)?,
        "pptx" => extract_pptx(path)?,
        "docx" => extract_docx(path)?,
        "jpg" | "jpeg" | "png" | "tiff" | "bmp" => extract_image_ocr(path)?,
        _ => return Ok(ExtractionResult {
            filename,
            format,
            text: String::new(),
            success: false,
            error: Some(format!("Unsupported format: {}", format)),
            page_count: None,
            char_count: 0,
        }),
    };

    Ok(ExtractionResult {
        filename,
        format,
        char_count: text.chars().count(),
        success: true,
        error: None,
        text,
        page_count: None,
    })
}

fn extract_pdf(path: &Path) -> Result<String> {
    let doc = PopplerDocument::new_from_file(&format!("file://{}", path.to_string_lossy()), None)
        .context("Failed to open PDF")?;
    
    let mut text = String::new();
    for i in 0..doc.n_pages() {
        if let Some(page) = doc.get_page(i) {
            if let Some(page_text) = page.text() {
                text.push_str(&page_text);
                text.push('\n');
            }
        }
    }
    Ok(text)
}

fn extract_pptx(path: &Path) -> Result<String> {
    // For PPTX, we'll use the docx crate which can also handle PPTX
    // Or fallback to a simpler approach
    let mut text = String::new();
    // PPTX is a zip of XML files - we can extract text from slides
    // Using a simple approach: read as zip and parse slide XMLs
    use std::io::Read;
    let file = fs::File::open(path)?;
    let mut archive = zip::ZipArchive::new(file)?;
    
    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        let name = file.name().to_string();
        if name.starts_with("ppt/slides/slide") && name.ends_with(".xml") {
            let mut content = String::new();
            file.read_to_string(&mut content)?;
            // Simple XML text extraction
            let stripped = strip_xml_tags(&content);
            text.push_str(&stripped);
            text.push('\n');
        }
    }
    Ok(text)
}

fn extract_docx(path: &Path) -> Result<String> {
    let docx = Docx::from_file(path).context("Failed to open DOCX")?;
    let mut text = String::new();
    for paragraph in docx.paragraphs {
        for run in paragraph.runs {
            text.push_str(&run.text);
        }
        text.push('\n');
    }
    Ok(text)
}

fn extract_image_ocr(path: &Path) -> Result<String> {
    let img = ImageReader::open(path)?.decode()?;
    let temp_path = format!("/tmp/extractor_ocr_{}.png", uuid::Uuid::new_v4());
    img.save(&temp_path)?;
    
    let text = Tesseract::new(&temp_path)?
        .lang("fra+eng")?
        .image_path(&temp_path)?
        .get_text()?;
    
    fs::remove_file(&temp_path).ok();
    Ok(text)
}

fn strip_xml_tags(xml: &str) -> String {
    let mut result = String::new();
    let mut in_tag = false;
    for c in xml.chars() {
        match c {
            '<' => in_tag = true,
            '>' => in_tag = false,
            _ if !in_tag => result.push(c),
            _ => {}
        }
    }
    // Clean up whitespace
    result.split_whitespace().collect::<Vec<_>>().join(" ")
}