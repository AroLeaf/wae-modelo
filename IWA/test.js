const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJhZG1pbiI6dHJ1ZX0.-fZzT0OTXW_W17FU2NGIc0LpD-DYcl0lhQjXLuZ_UUg';

const res = await fetch('http://localhost:3000/users', {
  // method: 'POST',
  // body: JSON.stringify({ name: 'Leaf', password: 'test' }),
  headers: {
    'Authorization': token,
    // 'Content-Type': 'application/json',
  },
});

const data = res.headers.get('content-type').startsWith('application/json') ? await res.json() : await res.text();
console.log(res.status, data);
