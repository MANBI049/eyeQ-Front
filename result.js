import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "본인 키 입력",
  authDomain: "server1-9be58.firebaseapp.com",
  projectId: "server1-9be58",
  storageBucket: "server1-9be58.firebasestorage.app",
  messagingSenderId: "938218854985",
  appId: "1:938218854985:web:5d2e7e347266ab55f63d98"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// URL에서 id 가져오기
// ex) result.html?id=abc123 → id = "abc123"
const params = new URLSearchParams(window.location.search);
const docId = params.get('id');

const resultImg = document.getElementById('resultImg');
const resultText = document.getElementById('resultText');

// Firestore에서 이미지 불러오기
async function loadResult() {
  try {
    const docRef = doc(db, 'uploads', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // 이미지 표시
      resultImg.src = data.imageData;

      // 나중에 Flask 결과 받으면 여기에 표시
      // resultText.textContent = data.result;

      resultText.textContent = '모델 연결 후 결과가 표시됩니다.';

    } else {
      resultText.textContent = '데이터를 찾을 수 없어요.';
    }

  } catch (error) {
    console.error('불러오기 실패:', error);
  }
}

loadResult();