<template>
  <div class="category-modal">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="category-modal-content" :class="{ mobile: isMobile }">
      <div class="modal-header">
        <h2>카테고리 선택</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <!-- 수입지출 선택(처음 선택을 자동 반영) -->
      <div class="tab-container">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'expense' }"
          @click="changeTab('expense')"
        >
          지출
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'income' }"
          @click="changeTab('income')"
        >
          수입
        </button>
      </div>

      <div class="category-list">
        <button
          v-for="(category, index) in filteredCategories"
          :key="index"
          class="category-item"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/styles/global.css";

export default {
  name: "CategoryModal",
  props: {
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
  },
  data() {
    return {
      activeTab: this.initialTab,
      isMobile: false,
    };
  },
  computed: {
    filteredCategories() {
      return this.categories[this.activeTab] || [];
    },
  },
  watch: {
    initialTab(newVal) {
      this.activeTab = newVal;
    },
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth < 768;
    },
    changeTab(tab) {
      this.activeTab = tab;
      this.$emit("tab-change", tab);
    },
    selectCategory(category) {
      this.$emit("select", category);
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.category-modal {
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

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.category-modal-content {
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

.category-modal-content.mobile {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font: var(--neo-bold-16);
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.tab-container {
  padding: 16px 20px;
  gap: 12px;
  display: flex;
}

.tab-button {
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

.tab-button.active {
  background-color: var(--primary-color);
  color: var(--text-color);
  font: var(--ng-bold-14);
}

.category-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 20px;
}

.category-item {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: var(--background-color);
  text-align: center;
  cursor: pointer;
  font: var(--ng-reg-14);
  transition: all 0.2s;
}

.category-item:hover {
  background-color: var(--secondary-color);
}
</style>
