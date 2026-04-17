export const resizeImage = (file, width, height) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png', 1.0));
      };
    };
  });
};

export const addTextToImage = (imageUrl, text, options = {}) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const fontSize = options.fontSize || (img.width / 15);
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = options.color || 'white';
      ctx.textAlign = 'center';
      
      // Shadow for readability
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      
      ctx.fillText(text, canvas.width / 2, canvas.height * 0.9);
      resolve(canvas.toDataURL('image/png'));
    };
  });
};
