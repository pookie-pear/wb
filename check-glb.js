const fs = require('fs');
try {
  const buf = fs.readFileSync('public/assets/jeans_model.glb');
  console.log('File size:', buf.length);
  console.log('Magic number (first 4 bytes):', buf.slice(0, 4).toString('hex'));
  if (buf.slice(0, 4).toString('hex') === '676c5446') {
    console.log('Valid GLB magic number (glTF).');
  } else {
    console.log('INVALID GLB magic number.');
  }
} catch (e) {
  console.error(e);
}
