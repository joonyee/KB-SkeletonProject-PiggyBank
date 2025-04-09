<!-- components/CategoryFilterModal.vue -->
<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <h3 class="modal-title">카테고리 선택</h3>
      <div class="checkboxes">
        <label v-for="category in allCategories" :key="category">
          <input type="checkbox" v-model="selected" :value="category" />
          {{ category }}
        </label>
      </div>
      <div class="modal-actions">
        <button @click="$emit('apply', selected)">적용</button>
        <button @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  categories: Array,
  selectedCategories: Array,
});

const selected = ref([...props.selectedCategories]);

watch(
  () => props.selectedCategories,
  (newVal) => {
    selected.value = [...newVal];
  }
);

const allCategories = props.categories;
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-weight: bold;
  margin-bottom: 16px;
  font-size: 18px;
  text-align: center;
}

.checkboxes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: center;
}
</style>
