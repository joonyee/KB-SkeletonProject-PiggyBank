<template>
  <div class="modal-container" v-if="isModalOpen">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal" :class="{ mobile: isMobile }">
      <div class="modal-header">
        <h2>거래 입력</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <!-- 수입지출 선택 -->
      <div class="tab-container">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'expense' }"
          @click="activeTab = 'expense'"
        >
          지출
        </button>

        <button
          class="tab-button"
          :class="{ active: activeTab === 'income' }"
          @click="activeTab = 'income'"
        >
          수입
        </button>
      </div>

      <!-- 모달 바디:하위 내용들 -->
      <div class="modal-body">
        <!-- 날짜 선택 -->
        <div class="form-group">
          <label>날짜</label>
          <input type="date" v-model="selectedDate" class="form-input" />
        </div>
        <!-- 카테고리 선택 -->
        <div class="form-group">
          <label>카테고리</label>
          <div
            class="category-select"
            :class="{
              error: showCategoryError,
              placeholder: !selectedCategory,
            }"
            @click="openCategoryModal"
          >
            {{ selectedCategory || "선택해주세요" }}
          </div>
          <div v-if="showCategoryError" class="error-message">
            카테고리를 선택해주세요
          </div>
        </div>

        <!-- 금액 입력 -->
        <div class="form-group">
          <label>금액</label>
          <input
            type="number"
            v-model="amount"
            placeholder="0"
            class="form-input"
          />
        </div>

        <!-- 설명 추가 -->
        <div class="form-group">
          <label>설명</label>
          <input
            type="text"
            v-model="description"
            placeholder="내용을 입력해주세요"
            class="form-input"
          />
        </div>

        <!-- 지불방법 -->
        <div class="form-group">
          <label>지불 방법</label>
          <div class="payment-method-container">
            <button
              class="payment-method-button"
              :class="{ active: paymentMethod === 'account' }"
              @click="paymentMethod = 'account'"
            >
              카드결제
            </button>
            <button
              class="payment-method-button"
              :class="{ active: paymentMethod === 'neutral' }"
              @click="paymentMethod = 'neutral'"
            >
              계좌거래
            </button>
            <button
              class="payment-method-button"
              :class="{ active: paymentMethod === 'negative' }"
              @click="paymentMethod = 'negative'"
            >
              현금
            </button>
          </div>
        </div>

        <!-- 지출성향 선택 -->
        <div class="form-group">
          <label>지출 성향</label>
          <div class="tendency-container">
            <button
              class="tendency-button"
              :class="{ active: spendingTendency === 'planned' }"
              @click="spendingTendency = 'planned'"
            >
              계획된 지출
            </button>
            <button
              class="tendency-button"
              :class="{ active: spendingTendency === 'impulsive' }"
              @click="spendingTendency = 'impulsive'"
            >
              충동적 지출
            </button>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="save-button" @click="saveTransaction">저장하기</button>
      </div>
    </div>

    <!-- 카테고리 선택 서브모달 -->
    <CategoryModal
      v-if="isCategoryModalOpen"
      :initialTab="activeTab"
      :categories="categories"
      @close="closeCategoryModal"
      @select="selectCategory"
      @tab-change="handleCategoryTabChange"
    />
  </div>
</template>

<script>
// global.css 파일 임포트
import "../assets/styles/global.css";
import CategoryModal from "./CategoryModal.vue";

export default {
  name: "FinanceModal",
  components: {
    CategoryModal,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isModalOpen: this.isOpen,
      isCategoryModalOpen: false,
      activeTab: "expense",
      selectedDate: this.formatDate(new Date()),
      selectedCategory: "",
      amount: "",
      description: "",
      paymentMethod: "account",
      spendingTendency: "planned",
      showCategoryError: false,
      isMobile: false,
      categories: {
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
      },
    };
  },
  watch: {
    isOpen(newVal) {
      this.isModalOpen = newVal;
    },
    activeTab() {
      this.selectedCategory = "";
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
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    },
    openCategoryModal() {
      this.isCategoryModalOpen = true;
      this.showCategoryError = false;
    },
    closeCategoryModal() {
      this.isCategoryModalOpen = false;
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
    handleCategoryTabChange(tab) {
      // 카테고리 모달에서 탭이 변경되면 메인 모달의 탭도 변경
      this.activeTab = tab;
    },
    saveTransaction() {
      if (!this.selectedCategory) {
        this.showCategoryError = true;
        return;
      }

      const transaction = {
        type: this.activeTab,
        category: this.selectedCategory,
        amount: this.amount,
        description: this.description,
        paymentMethod: this.paymentMethod,
        spendingTendency: this.spendingTendency,
        date: this.selectedDate,
      };

      this.$emit("save", transaction);
      this.resetForm();
      this.closeModal();
    },
    resetForm() {
      this.selectedCategory = "";
      this.amount = "";
      this.description = "";
      this.paymentMethod = "account";
      this.spendingTendency = "planned";
      this.selectedDate = this.formatDate(new Date());
      this.showCategoryError = false;
    },
    closeModal() {
      this.resetForm();
      this.isModalOpen = false;
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  position: relative;
  background-color: var(--background-color);
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  max-height: none; /* 💥 제한 없애기 */
  height: auto; /* 내용에 맞게 자동 조절 */
  overflow: visible; /* 스크롤바 없애기 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  font-family: var(--font-nanum-gothic);
  color: var(--text-color);
}

.modal.mobile {
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
  padding: 15px 20px;
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
  display: flex;
  gap: 8px; /* 버튼 사이 간격 */
  margin: 0px 20px;
}

.tab-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font: var(--ng-bold-14);
  cursor: pointer;
  background-color: #f5f5f5;
  color: #999;
  transition: background-color 0.2s, color 0.2s;
}

.tab-button.active {
  background-color: var(--primary-color);
  color: var(--text-color);
}

.tab-button:first-child {
  border-top-left-radius: 8px;
}

.tab-button:last-child {
  border-top-right-radius: 8px;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-group label {
  font: var(--ng-reg-13);
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font: var(--ng-reg-14);
  color: var(--text-color);
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--text-secondary);
}

.category-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: var(--background-color);
  cursor: pointer;
  color: var(--text-color);
  font: var(--ng-reg-14);
  box-sizing: border-box;
}

.category-select.placeholder {
  color: var(--text-secondary); /* 카테고리 선택 전 */
}

.category-select.error {
  border-color: var(--text-error);
}

.error-message {
  color: var(--text-error);
  font: var(--ng-reg-12);
  margin-top: 4px;
}

.payment-method-container {
  display: flex;
  gap: 8px;
  width: 100%;
}

.payment-method-button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: var(--background-color);
  cursor: pointer;
  color: var(--text-secondary);
  font: var(--ng-reg-14);
  transition: all 0.2s;
}

.payment-method-button.active {
  background-color: var(--primary-color);
  color: var(--text-color);
  border-color: var(--primary-color);
}

.tendency-container {
  display: flex;
  gap: 8px;
  width: 100%;
}

.tendency-button {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  color: var(--text-secondary);
  font: var(--ng-reg-14);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.tendency-button.active {
  background-color: var(--primary-color);
  color: var(--text-color);
  border-color: var(--primary-color);
}

.modal-footer {
  padding: 0 20px 20px;
  background: var(--background-color);
  padding: 20px 20px;
  border-radius: 0 0 12px 12px;
}

.save-button {
  width: 100%;
  padding: 14px;
  background-color: var(--secondary-color);
  border: none;
  border-radius: 6px;
  color: var(--text-color);
  font: var(--neo-bold-15);
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #ffa6d8;
}

/* 크롬, 사파리, 엣지(금액에서 스핀버튼 제거를 위함)*/
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 파이어폭스 */
input[type="number"] {
  -moz-appearance: textfield;
}

/* 반응형: 지불방법 버튼 세로로 전환 */
@media (max-width: 767px) {
  .payment-method-container,
  .tendency-method-container {
    flex-direction: column;
  }
  .modal.mobile {
    height: 100%;
    max-height: 100%;
    overflow-y: auto; /* 모바일에서만 세로 스크롤 허용 */
  }

  .modal-footer {
    border-top: 1px solid #ddd;

    bottom: 0;
    position: sticky;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  }
}
</style>
