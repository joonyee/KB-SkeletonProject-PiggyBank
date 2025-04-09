<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      viewBox="0 0 200 200"
  >
    <!-- 그라디언트 정의 -->
    <defs>
      <radialGradient id="faceGradient" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#FFD8F0" />
        <stop offset="100%" stop-color="#FFA8DC" />
      </radialGradient>
      <radialGradient id="earGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFD0EB" />
        <stop offset="100%" stop-color="#FF9FD6" />
      </radialGradient>
    </defs>

    <!-- 귀 -->
    <circle :cx="earLeft.cx" :cy="earLeft.cy" :r="earSize" fill="url(#earGradient)" />
    <circle :cx="earRight.cx" :cy="earRight.cy" :r="earSize" fill="url(#earGradient)" />

    <!-- 얼굴 -->
    <circle cx="100" cy="100" :r="faceRadius" fill="url(#faceGradient)" />

    <!-- 왼쪽 눈 -->
    <rect
        :x="eyeLeft.x"
        :y="eyeLeft.y"
        :width="eyeSize.width"
        :height="eyeSize.height"
        rx="3"
        fill="#000"
        class="blink"
    />
    <circle
        :cx="eyeLeft.x + eyeSize.width / 2"
        :cy="eyeLeft.y + eyeSize.height / 2"
        :r="eyeHighlightSize"
        fill="white"
    />

    <!-- 오른쪽 눈 -->
    <rect
        :x="eyeRight.x"
        :y="eyeRight.y"
        :width="eyeSize.width"
        :height="eyeSize.height"
        rx="3"
        fill="#000"
        class="blink"
    />
    <circle
        :cx="eyeRight.x + eyeSize.width / 2"
        :cy="eyeRight.y + eyeSize.height / 2"
        :r="eyeHighlightSize"
        fill="white"
    />

    <!-- 코 -->
    <ellipse
        cx="100"
        :cy="nosePosition.cy"
        :rx="noseSize.rx"
        :ry="noseSize.ry"
        fill="#FFB6DC"
    />
    <ellipse
        cx="100"
        :cy="nosePosition.cy"
        :rx="noseSize.rx"
        :ry="noseSize.ry"
        fill="rgba(0, 0, 0, 0.05)"
    />
    <circle :cx="noseHoles.left.cx" :cy="noseHoles.left.cy" :r="noseHoleSize" fill="#000" />
    <circle :cx="noseHoles.right.cx" :cy="noseHoles.right.cy" :r="noseHoleSize" fill="#000" />
  </svg>
</template>

<script setup>
import {useDashboardStore} from "@/stores/store.js";

const dashboard = useDashboardStore();
const savingsRate = dashboard.savingsAmount;

// 기본 크기 설정
const baseSize = 200;

// 크기 비율 계산 (저축률 기반)

const sizeRatio = savingsRate / 100 + 0.2; // 크기 비율 (0~1 사이) + 기본값 0.2
const size = baseSize * (0.6 + sizeRatio * 0.4) ; // 결과 60% ~ 100% 크기
console.log(size);

// 얼굴 크기
const faceRadius = 80 * sizeRatio; // 얼굴 반지름

// 귀 크기와 위치 계산
const earSize = 15 * sizeRatio; // 귀 크기
const earLeft = { cx: 100 - faceRadius * 0.55, cy: 100 - faceRadius * 0.7 }; // 왼쪽 귀 중심
const earRight = { cx: 100 + faceRadius * 0.55, cy: 100 - faceRadius * 0.7 }; // 오른쪽 귀 중심

// 눈 크기와 위치 계산
const eyeSize = {
  width: 10 * sizeRatio, // 눈 너비
  height: 25 * sizeRatio, // 눈 높이
};
const eyeHighlightSize = 2 * sizeRatio; // 눈 하이라이트 크기
const eyeLeft = {
  x: 100 - faceRadius * 0.3 - eyeSize.width / 2,
  y: 100 - faceRadius * 0.1 - eyeSize.height / 2,
};
const eyeRight = {
  x: 100 + faceRadius * 0.3 - eyeSize.width / 2,
  y: 100 - faceRadius * 0.1 - eyeSize.height / 2,
};

// 코 크기와 위치 계산
const noseSize = {
  rx: 30 * sizeRatio, // 코 타원의 x 반지름
  ry: 20 * sizeRatio, // 코 타원의 y 반지름
};
const nosePosition = {
  cy: 100 + faceRadius * 0.3, // 얼굴 크기에 따라 코의 y 위치를 조정
};

// 코 구멍 크기와 위치
const noseHoleSize = 5 * sizeRatio; // 코 구멍 크기
const noseHoles = {
  left: {
    cx: 100 - noseSize.rx * 0.4, // 코 타원의 중심에서 좌측 위치
    cy: nosePosition.cy, // 코 위치와 동일
  },
  right: {
    cx: 100 + noseSize.rx * 0.4, // 코 타원의 중심에서 우측 위치
    cy: nosePosition.cy, // 코 위치와 동일
  },
};
</script>

<style scoped>
.blink {
  animation: blinkAnim 3s infinite;
  transform-origin: center center;
}

@keyframes blinkAnim {
  0%,
  94%,
  100% {
    transform: scaleY(1);
  }
  95%,
  97% {
    transform: scaleY(0.1);
  }
}
</style>