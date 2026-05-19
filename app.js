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
    uploadToServer(file);
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
    uploadToServer(file);
  }
});

// 로컬 미리보기
function showPreview(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
    previewImg.style.display = 'block';
    uploadText.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// 백엔드 API에 업로드
async function uploadToServer(file) {
  try {
    uploadBtn.textContent = '업로드 중...';
    uploadBtn.disabled = true;

    const formData = new FormData();
    formData.append("image", File); 

    const response = await fetch("https://guide-angles-muzzle.ngrok-free.dev/api/images", {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "1",
      },
      body: formData,
    });

    const result = await response.json();
    console.log('업로드 완료:', result);

    uploadBtn.textContent = '업로드 완료 ✓';

    // Firestore 문서 ID를 가지고 result.html로 이동
    window.location.href = `result.html?id=${result.id}`;

  } catch (error) {
    console.error('업로드 실패:', error);
    uploadBtn.textContent = '업로드 실패 ✗';
    uploadBtn.disabled = false;
  }
}