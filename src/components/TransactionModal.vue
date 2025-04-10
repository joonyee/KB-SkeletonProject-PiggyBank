<template>
  <div class="modalContainer" v-if="isModalOpen">
    <div class="modalBackdrop" @click="closeModal"></div>
    <div class="modal" :class="{ mobile: isMobile }">
      <div class="modalHeader">
        <h2>거래 입력</h2>
        <button class="closeButton" @click="closeModal">&times;</button>
      </div>

      <!-- 수입지출 선택 -->
      <div class="tabContainer">
        <button
          class="tabButton"
          :class="{ active: activeTab === 'expense' }"
          @click="activeTab = 'expense'"
        >
          지출
        </button>
        <button
          class="tabButton"
          :class="{ active: activeTab === 'income' }"
          @click="activeTab = 'income'"
        >
          수입
        </button>
      </div>

      <!-- 날짜 선택 -->
      <div class="modalBody">
        <div class="formGroup">
          <label>날짜</label>
          <input type="date" v-model="selectedDate" class="formInput" />
        </div>

        <!-- 카테고리 선택 -->
        <div class="formGroup">
          <label>카테고리</label>
          <div
            class="categorySelect"
            :class="{
              error: showCategoryError,
              placeholder: !selectedCategory,
            }"
            @click="openCategoryModal"
          >
            {{ selectedCategory || "선택해주세요" }}
          </div>
          <div v-if="showCategoryError" class="errorMessage">
            카테고리를 선택해주세요
          </div>
        </div>

        <!-- 금액 입력 -->
        <div class="formGroup">
          <label>금액</label>
          <input
            type="number"
            v-model="amount"
            placeholder="0"
            class="formInput"
          />
        </div>

        <!-- 메모 작성 -->
        <div class="formGroup">
          <label>설명</label>
          <input
            type="text"
            v-model="description"
            placeholder="내용을 입력해주세요"
            class="formInput"
          />
        </div>

        <!-- 지불방법 선택 -->
        <div v-if="activeTab === 'expense'">
          <div class="formGroup">
            <label>지불 방법</label>
            <div class="paymentMethodContainer">
              <button
                class="paymentMethodButton"
                :class="{ active: paymentMethod === 'account' }"
                @click="paymentMethod = 'account'"
              >
                카드결제
              </button>
              <button
                class="paymentMethodButton"
                :class="{ active: paymentMethod === 'neutral' }"
                @click="paymentMethod = 'neutral'"
              >
                계좌거래
              </button>
              <button
                class="paymentMethodButton"
                :class="{ active: paymentMethod === 'negative' }"
                @click="paymentMethod = 'negative'"
              >
                현금
              </button>
            </div>
          </div>

          <!-- 지출성향 선택 -->
          <div class="formGroup">
            <label>지출 성향</label>
            <div class="tendencyContainer">
              <button
                class="tendencyButton"
                :class="{ active: tendency === 'planned' }"
                @click="tendency = 'planned'"
              >
                계획된 지출
              </button>
              <button
                class="tendencyButton"
                :class="{ active: tendency === 'impulsive' }"
                @click="tendency = 'impulsive'"
              >
                충동적 지출
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modalFooter">
        <button class="saveButton" @click="saveTransaction">저장하기</button>
      </div>
    </div>

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

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import CategoryModal from "./CategoryModal.vue";
import { useRouter } from "vue-router";
import "../assets/styles/global.css";

// 외부에서 전달받은 모달 열림 상태
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save", "close"]);
const router = useRouter();

// 상태 변수 정의
const isModalOpen = ref(props.isOpen);
const isCategoryModalOpen = ref(false);
const activeTab = ref("expense");
const selectedDate = ref(formatDate(new Date()));
const selectedCategory = ref("");
const amount = ref("");
const description = ref("");
const paymentMethod = ref("account");
const tendency = ref("planned");
const showCategoryError = ref(false);
const isMobile = ref(false);

// 로그인된 유저 정보
const userInfo = JSON.parse(localStorage.getItem("loggedInUserInfo") || "{}");
const userId = ref(userInfo.id || ""); // 유저 고유ID
const userAgeId = ref(userInfo.age || null); // 연령대 ID

// 카테고리 정의
const categories = {
  income: ["급여", "용돈", "부수입", "환급/지원금", "기타수입"],
  expense: [
    "식사/카페",
    "배달/간식",
    "쇼핑",
    "교통/차량",
    "주거/관리",
    "건강/병원",
    "취미/여가",
    "구독서비스",
    "여행/외출",
    "기타지출",
  ],
};

// 카테고리명 → ID 매핑
const categoryMap = {
  급여: 1,
  용돈: 2,
  부수입: 3,
  "환급/지원금": 4,
  기타수입: 5,
  "식사/카페": 6,
  "배달/간식": 7,
  쇼핑: 8,
  "교통/차량": 9,
  "주거/관리": 10,
  "건강/병원": 11,
  "취미/여가": 12,
  구독서비스: 13,
  "여행/외출": 14,
  기타지출: 15,
};

// 소비 성향 → ID 매핑
const tendencyMap = {
  planned: 1,
  impulsive: 2,
  수입: 3,
};

// 결제 수단 → ID 매핑
const paymentMap = {
  account: 1,
  negative: 2,
  neutral: 3,
};

// 모달 열림 상태 감지
watch(
  () => props.isOpen,
  (newVal) => {
    isModalOpen.value = newVal;
  }
);

// 탭 전환 시 카테고리 초기화
watch(activeTab, () => {
  selectedCategory.value = "";
});

// 날짜 포맷
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

// 모바일 감지
function checkScreenSize() {
  isMobile.value = window.innerWidth < 768;
}

// 카테고리 모달 핸들링
function openCategoryModal() {
  isCategoryModalOpen.value = true;
  showCategoryError.value = false;
}
function closeCategoryModal() {
  isCategoryModalOpen.value = false;
}
function selectCategory(category) {
  selectedCategory.value = category;
}
function handleCategoryTabChange(tab) {
  activeTab.value = tab;
}

// 거래 저장
async function saveTransaction() {
  if (!userId.value) {
    alert("로그인이 필요합니다.");
    router.push("/login");
    return;
  }

  if (!userAgeId.value) {
    alert("회원 정보에 연령대가 없습니다.");
    return;
  }

  if (!selectedCategory.value) {
    showCategoryError.value = true;
    return;
  }

  const isIncome = activeTab.value === "income";
  const typeId = isIncome ? 1 : 2;
  const categoryId = categoryMap[selectedCategory.value];

  if (!categoryId) {
    alert("유효하지 않은 카테고리입니다.");
    console.error("카테고리 매핑 오류:", selectedCategory.value);
    return;
  }

  const transaction = {
    userid: String(userId.value),
    typeid: typeId,
    categoryid: categoryId,
    date: selectedDate.value,
    amount: Number(amount.value),
    tendencyid: isIncome ? 3 : tendencyMap[tendency.value],
    payment: isIncome ? 4 : paymentMap[paymentMethod.value],
    memo: description.value,
    ageid: userAgeId.value,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/money",
      transaction
    );
    console.log("저장 성공:", response.data);
    alert("거래가 저장되었습니다");

    emit("save", response.data);
    resetForm();
    closeModal();
  } catch (error) {
    console.error("저장 실패:", error);
    alert("저장 중 오류가 발생했습니다.");
  }
}

// 초기화 및 모달 닫기
function resetForm() {
  selectedCategory.value = "";
  amount.value = "";
  description.value = "";
  paymentMethod.value = "account";
  tendency.value = "planned";
  selectedDate.value = formatDate(new Date());
  showCategoryError.value = false;
}

function closeModal() {
  resetForm();
  isModalOpen.value = false;
  emit("close");
}

// 화면 크기 감지 및 로그인 체크
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  if (!userId.value) {
    alert("로그인이 필요합니다.");
    router.push("/login");
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
.modalContainer {
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

.modalBackdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  position: relative;
  background-color: white;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  max-height: none;
  height: auto;
  overflow: visible;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  font-family: var(--font-nanum-gothic);
  color: #333333;
}

.modal.mobile {
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
  padding: 15px 20px;
}

.modalHeader h2 {
  margin: 0;
  font: var(--neo-bold-16);
  color: #333333;
}

.closeButton {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #969696;
}

.tabContainer {
  display: flex;
  gap: 8px;
  margin: 0px 20px;
}

.tabButton {
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

.tabButton.active {
  background-color: #ffc7ef;
  color: #333333;
}

.tabButton:first-child {
  border-top-left-radius: 8px;
}

.tabButton:last-child {
  border-top-right-radius: 8px;
}

.modalBody {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.formGroup label {
  font: var(--ng-reg-13);
  color: #969696;
}

.formInput {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font: var(--ng-reg-14);
  color: #333333;
  box-sizing: border-box;
}

.formInput::placeholder {
  color: #969696;
}

.categorySelect {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  color: #333333;
  font: var(--ng-reg-14);
  box-sizing: border-box;
}

.categorySelect.placeholder {
  color: #969696;
}

.categorySelect.error {
  border-color: #e60000;
}

.errorMessage {
  color: #e60000;
  font: var(--ng-reg-12);
  margin-top: 4px;
}

.paymentMethodContainer {
  display: flex;
  gap: 8px;
  width: 100%;
}

.paymentMethodButton {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  color: #969696;
  font: var(--ng-reg-14);
  transition: all 0.2s;
}

.paymentMethodButton.active {
  background-color: #ffc7ef;
  color: #333333;
  border-color: #ffc7ef;
}

.tendencyContainer {
  display: flex;
  gap: 8px;
  width: 100%;
}

.tendencyButton {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  color: #969696;
  font: var(--ng-reg-14);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.tendencyButton.active {
  background-color: #ffc7ef;
  color: #333333;
  border-color: #ffc7ef;
}

.modalFooter {
  padding: 0 20px 20px;
  background: white;
  padding: 20px 20px;
  border-radius: 0 0 12px 12px;
}

.saveButton {
  width: 100%;
  padding: 14px;
  background-color: #ffe8fc;
  border: none;
  border-radius: 6px;
  color: #333333;
  font: var(--neo-bold-15);
  cursor: pointer;
  transition: background-color 0.2s;
}

.saveButton:hover {
  background-color: #ffa6d8;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}

/* 다크모드 스타일 */
.dark .modal {
  background-color: #2e2e4d;
}
.dark .modalBody {
  background-color: #2e2e4d;
}

.dark .modalFooter {
  background-color: #2e2e4d;
}

@media (max-width: 767px) {
  .paymentMethodContainer,
  .tendencyMethodContainer {
    flex-direction: column;
  }
  .modal.mobile {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
  }

  .modalFooter {
    border-top: 1px solid #ddd;
    bottom: 0;
    position: sticky;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  }
}
</style>
