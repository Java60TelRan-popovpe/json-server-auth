const jsonServer = require('json-server')
const auth = require('json-server-auth')

const fs = require('fs');
const path = require('path');

const errorFile = path.join(__dirname, 'error-trigger.txt');

let errorCode = null;

// Function to read and update error code from file
const updateErrorCode = () => {
  fs.readFile(errorFile, 'utf8', (err, data) => {
    if (err) {
      console.error("[error-trigger] Cannot read file:", err.message);
      errorCode = null;
      return;
    }

    const code = parseInt(data.trim(), 10);
    if (!data.trim()) {
      console.log("[error-trigger] File is empty, clearing simulated error");
      errorCode = null;
    } else if (!isNaN(code) && code >= 400 && code < 600) {
      errorCode = code;
      console.log(`[error-trigger] Simulating HTTP ${code} error`);
    } else {
      console.warn(`[error-trigger] Invalid content "${data.trim()}", ignoring`);
      errorCode = null;
    }
  });
};

// Watch the file for changes
fs.watch(errorFile, (eventType) => {
  if (eventType === 'change') {
    updateErrorCode();
  }
});

// Initial read
updateErrorCode();


const app = jsonServer.create()
const router = jsonServer.router('db.json')

// Required for request parsing, CORS, etc.
const middlewares = jsonServer.defaults()
app.use(middlewares)

// Set custom CORS headers (optional override)
app.use((req, res, next) => {
  if (errorCode) {
    return res.status(errorCode).json({
      error: `Simulated HTTP ${errorCode} error from file`
    });
  }
  next();
});
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

// Required by json-server-auth
app.db = router.db

// Optional auth rules
const rules = auth.rewriter({
  employees: 640,
  users: 600,
})
app.use(rules)
app.use(auth)
app.use(router)

app.listen(3000, () => {
  console.log('JSON Server running on http://localhost:3000')
})