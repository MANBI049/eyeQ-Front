import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyDEsigQt-WT2P2dmQgOlYZ0SekQvV0j87w",
  authDomain: "server1-9be58.firebaseapp.com",
  projectId: "server1-9be58",
  storageBucket: "server1-9be58.firebasestorage.app",
  messagingSenderId: "938218854985",
  appId: "1:938218854985:web:5d2e7e347266ab55f63d98"
};

// Firebase 초기화 (Storage 제거, Firestore만 사용)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML 요소 가져오기
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewImg = document.getElementById('previewImg');
const uploadText = document.getElementById('uploadText');
const uploadBtn = document.getElementById('uploadBtn');

// 업로드 버튼 → 파일 선택창 열기
uploadBtn.addEventListener('click', () => fileInput.click());

// 파일 선택했을 때
fileInput.addEventListener('change', function () {
  const file = fileInput.files[0];
  if (file) {
    showPreview(file);
    uploadToFirestore(file);
  }
});

// 드래그 오버
dropZone.addEventListener('dragover', function (e) {
  e.preventDefault();
  dropZone.style.backgroundColor = '#d0d8e8';
});

// 드래그 나갔을 때
dropZone.addEventListener('dragleave', function () {
  dropZone.style.backgroundColor = '';
});

// 드롭했을 때
dropZone.addEventListener('drop', function (e) {
  e.preventDefault();
  dropZone.style.backgroundColor = '';
  const file = e.dataTransfer.files[0];
  if (file) {
    showPreview(file);
    uploadToFirestore(file);
  }
});

// 미리보기
function showPreview(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
    previewImg.style.display = 'block';
    uploadText.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// Firestore에 Base64로 저장
function uploadToFirestore(file) {
  const reader = new FileReader();

  reader.onload = async function (e) {
    try {
      uploadBtn.textContent = '업로드 중...';
      uploadBtn.disabled = true;

      const base64Image = e.target.result;

      // Firestore에 저장
      const docRef = await addDoc(collection(db, 'uploads'), {
        imageData: base64Image,
        fileName: file.name,
        uploadedAt: new Date()
      });

      console.log('업로드 완료!');
      uploadBtn.textContent = '업로드 완료 ✓';

      // 저장된 문서 ID를 가지고 결과 페이지로 이동
      window.location.href = `result.html?id=${docRef.id}`;

    } catch (error) {
      console.error('업로드 실패:', error);
      uploadBtn.textContent = '업로드 실패 ✗';
      uploadBtn.disabled = false;
    }
  };

  reader.readAsDataURL(file);
}