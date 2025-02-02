const path = require('path');
const fs = require('fs');

// 创建测试用的临时文件
const createTestFiles = () => {
  const testDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // 创建测试图片
  const imageFile = path.join(testDir, 'test-image.jpg');
  fs.writeFileSync(imageFile, 'fake image content');

  // 创建测试视频
  const videoFile = path.join(testDir, 'test-video.mp4');
  fs.writeFileSync(videoFile, 'fake video content');

  return {
    imageFile,
    videoFile
  };
};

// 清理测试文件
const cleanupTestFiles = () => {
  const testDir = path.join(__dirname, '../temp');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
};

module.exports = {
  createTestFiles,
  cleanupTestFiles
};
