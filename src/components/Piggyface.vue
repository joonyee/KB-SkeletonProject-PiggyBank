<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
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
    <circle cx="55" cy="40" r="15" fill="url(#earGradient)" />
    <circle cx="145" cy="40" r="15" fill="url(#earGradient)" />

    <!-- 얼굴 -->
    <circle cx="100" cy="100" r="80" fill="url(#faceGradient)" />

    <!-- 모자 -->
    <g>
      <ellipse cx="100" cy="55" rx="40" ry="6" fill="#222" />
      <rect x="70" y="20" width="60" height="35" rx="4" fill="#222" />
      <rect x="70" y="38" width="60" height="5" fill="#444" />
    </g>

    <!-- 눈 -->
    <g v-if="!isEyeClosed">
      <!-- 왼쪽 눈 -->
      <rect
          :x="70 + eyeOffset.x"
          :y="80 + eyeOffset.y"
          width="10"
          height="25"
          rx="3"
          fill="#000"
          class="blink"
      />
      <circle
          :cx="75 + eyeOffset.x"
          :cy="85 + eyeOffset.y"
          r="2"
          fill="white"
      />
      <!-- 오른쪽 눈 -->
      <rect
          :x="120 + eyeOffset.x"
          :y="80 + eyeOffset.y"
          width="10"
          height="25"
          rx="3"
          fill="#000"
          class="blink"
      />
      <circle
          :cx="125 + eyeOffset.x"
          :cy="85 + eyeOffset.y"
          r="2"
          fill="white"
      />
    </g>

    <!-- 감은 눈 -->
    <g v-else>
      <!-- 왼쪽 눈 감기 -->
      <line
          :x1="70 + eyeOffset.x"
          :y1="92 + eyeOffset.y"
          :x2="80 + eyeOffset.x"
          :y2="92 + eyeOffset.y"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
      />
      <!-- 오른쪽 눈 감기 -->
      <line
          :x1="120 + eyeOffset.x"
          :y1="92 + eyeOffset.y"
          :x2="130 + eyeOffset.x"
          :y2="92 + eyeOffset.y"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
      />
    </g>

    <!-- 코 -->
    <ellipse cx="100" cy="130" rx="30" ry="20" fill="#FFB6DC" />
    <ellipse cx="100" cy="130" rx="30" ry="20" fill="rgba(0, 0, 0, 0.05)" />
    <circle cx="90" cy="130" r="5" fill="#000" />
    <circle cx="110" cy="130" r="5" fill="#000" />
  </svg>
</template>

<script setup>
defineProps({
  eyeOffset: {
    type: Object,
    required: true,
  },
  isEyeClosed: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
/* 깜박이는 동작 추가 */
.blink {
  animation: blinkAnim 3s infinite;
  transform-origin: center center;
}

/* 기본 깜박이는 모션 */
@keyframes blinkAnim {
  0%, 94%, 100% {
    transform: scaleY(1);
  }
  95%, 97% {
    transform: scaleY(0.1);
  }
}

/* 눈 감는 추가 애니메이션 */
.eye-close-motion {
  animation: eyeClose 0.3s forwards;
}

@keyframes eyeClose {
  10% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
  }
}
</style>