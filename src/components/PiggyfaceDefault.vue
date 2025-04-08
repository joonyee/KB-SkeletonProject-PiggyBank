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

    <!-- 귀 (얼굴보다 먼저 그려서 뒤로 감) -->
    <circle cx="55" cy="40" r="15" fill="url(#earGradient)" />
    <circle cx="145" cy="40" r="15" fill="url(#earGradient)" />

    <!-- 얼굴 -->
    <circle cx="100" cy="100" r="80" fill="url(#faceGradient)" />

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

    <!-- 코 -->
    <ellipse cx="100" cy="130" rx="30" ry="20" fill="#FFB6DC" />
    <ellipse cx="100" cy="130" rx="30" ry="20" fill="rgba(0, 0, 0, 0.05)" />
    <circle cx="90" cy="130" r="5" fill="#000" />
    <circle cx="110" cy="130" r="5" fill="#000" />
  </svg>
</template>

<script setup>
const eyeOffset = { x: 0, y: 0 };
</script>

<style scoped>
.blink {
  animation: blinkAnim 3s infinite;
  transform-origin: center center;
}

@keyframes blinkAnim {
  0%, 94%, 100% {
    transform: scaleY(1);
  }
  95%, 97% {
    transform: scaleY(0.1);
  }
}
</style>
