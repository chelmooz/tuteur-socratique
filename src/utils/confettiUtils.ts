/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import confetti from 'canvas-confetti';

export function fireTaskConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']
    });
  } catch {
    // Graceful fallback
  }
}

export function fireLevelUpConfetti() {
  try {
    const end = Date.now() + 1500;
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#fbbf24', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {}
}

export function fireQuizSuccessConfetti() {
  try {
    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7']
    });
  } catch {}
}
