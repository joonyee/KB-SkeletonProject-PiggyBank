<!-- <script setup>
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

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <h3 class="modal-title">카테고리 선택</h3>
      <div class="checkboxes">
        <label
          v-for="category in allCategories"
          :key="category"
          class="checkbox-item"
        >
          <input type="checkbox" v-model="selected" :value="category" />
          <span class="custom-checkbox">{{ category }}</span>
        </label>
      </div>
      <div class="modal-actions">
        <button class="apply-btn" @click="$emit('apply', selected)">
          적용
        </button>
        <button class="cancel-btn" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

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
  background-color: var(--card-color);
  border-radius: 16px;
  padding: 30px;
  width: 420px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font: var(--ng-bold-20);
  text-align: center;
  margin-bottom: 24px;
  color: var(--text-color);
}

.checkboxes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 10px;
  margin-bottom: 24px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  font: var(--ng-reg-16);
  color: var(--text-color);
  gap: 10px;
}

.checkbox-item input[type='checkbox'] {
  accent-color: var(--primary-color);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.apply-btn,
.cancel-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font: var(--ng-reg-16);
}

.apply-btn {
  background-color: var(--primary-color);
  color: white;
}

.cancel-btn {
  background-color: #e4e4e4;
  color: var(--text-color);
}
</style> -->

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

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <h3 class="modal-title">카테고리 선택</h3>
      <div class="checkboxes">
        <label
          v-for="category in allCategories"
          :key="category"
          class="checkbox-item"
        >
          <input type="checkbox" v-model="selected" :value="category" />
          <span class="custom-checkbox">{{ category }}</span>
        </label>
      </div>
      <div class="modal-actions">
        <button class="apply-btn" @click="$emit('apply', selected)">
          적용
        </button>
        <button class="cancel-btn" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

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
  background-color: var(--card-color);
  border-radius: 16px;
  padding: 30px;
  width: 420px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font: var(--ng-bold-20);
  text-align: center;
  margin-bottom: 24px;
  color: var(--text-color);
}

.checkboxes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 10px;
  margin-bottom: 24px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  font: var(--ng-reg-16);
  color: var(--text-color);
  gap: 10px;
}

.checkbox-item input[type='checkbox'] {
  accent-color: var(--primary-color);
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.apply-btn,
.cancel-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font: var(--ng-reg-16);
}

.apply-btn {
  background-color: var(--primary-color);
  color: white;
}

.cancel-btn {
  background-color: #e4e4e4;
  color: var(--text-color);
}
</style>
