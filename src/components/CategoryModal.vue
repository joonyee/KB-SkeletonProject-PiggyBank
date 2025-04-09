<template>
  <div class="categoryModal">
    <div class="modalBackdrop" @click="closeModal"></div>
    <div class="categoryModalContent" :class="{ mobile: isMobile }">
      <div class="modalHeader">
        <h2>카테고리 선택</h2>
        <button class="closeButton" @click="closeModal">&times;</button>
      </div>

      <!-- 수입지출 선택 반영-->
      <div class="tabContainer">
        <button
          class="tabButton"
          :class="{ active: activeTab === 'expense' }"
          @click="changeTab('expense')"
        >
          지출
        </button>
        <button
          class="tabButton"
          :class="{ active: activeTab === 'income' }"
          @click="changeTab('income')"
        >
          수입
        </button>
      </div>

      <div class="categoryList">
        <button
          v-for="(category, index) in filteredCategories"
          :key="index"
          class="categoryItem"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import "../assets/styles/global.css";

const props = defineProps({
  initialTab: {
    type: String,
    default: "income",
    validator: (value) => ["income", "expense"].includes(value),
  },
  categories: {
    type: Object,
    default: () => ({
      income: ["급여", "용돈", "부수입", "기타수입"],
      expense: [
        "식비",
        "교통비",
        "주거비",
        "의류비",
        "의료비",
        "여가비",
        "교육비",
        "기타지출",
      ],
    }),
  },
});

const emit = defineEmits(["close", "select", "tab-change"]);

const activeTab = ref(props.initialTab);
const isMobile = ref(false);

const filteredCategories = computed(
  () => props.categories[activeTab.value] || []
);

watch(
  () => props.initialTab,
  (newVal) => {
    activeTab.value = newVal;
  }
);

function checkScreenSize() {
  isMobile.value = window.innerWidth < 768;
}

function changeTab(tab) {
  activeTab.value = tab;
  emit("tab-change", tab);
}

function selectCategory(category) {
  emit("select", category);
  closeModal();
}

function closeModal() {
  emit("close");
}

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
.categoryModal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  background-color: rgba(0, 0, 0, 0.5);
}

.modalBackdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.categoryModalContent {
  position: relative;
  background-color: var(--background-color);
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1101;
}

.categoryModalContent.mobile {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 0;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.modalHeader h2 {
  margin: 0;
  font: var(--neo-bold-16);
  color: var(--text-color);
}

.closeButton {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.tabContainer {
  padding: 16px 20px;
  gap: 12px;
  display: flex;
}

.tabButton {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: #f5f5f5;
  color: #999;
  font: var(--ng-bold-14);
  cursor: pointer;
  transition: background-color 0.2s;
}

.tabButton.active {
  background-color: var(--primary-color);
  color: var(--text-color);
  font: var(--ng-bold-14);
}

.categoryList {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px;
}

.categoryItem {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: var(--background-color);
  text-align: center;
  cursor: pointer;
  font: var(--ng-reg-14);
  transition: all 0.2s;
}

.categoryItem:hover {
  background-color: var(--secondary-color);
}
</style>
