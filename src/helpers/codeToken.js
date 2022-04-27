const nums = '0123456789';
let token = '';
for (let i = 0; i < 6; i++) {
  token += nums[Math.floor(Math.random() * nums.length)];
}

module.exports = token;
