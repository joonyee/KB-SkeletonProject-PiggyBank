<script setup lang="ts">
import { useToast } from 'vue-toastification';

const toast = useToast();

function showToast() {
  toast.success('오늘의 소비');
  //   // 또는
  //   toast.error('오류가 발생했어요 😢')
  //   toast.info('정보 메시지')
  //   toast.warning('경고 메시지')
}
</script>

<template>
  <button @click="showToast">토스트 띄우기</button>
</template>
