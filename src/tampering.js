// tampering.js
// Fully client-side tampering detection logic

const TamperingDetector = (() => {
  function getHash(str) {
    // Simple hash for demonstration, consider SHA256 for real deployment
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }

  function checkElementIntegrity(selector, originalHtml) {
    const el = document.querySelector(selector);
    return el && el.innerHTML === originalHtml;
  }

  function checkScriptIntegrity(scriptName, expectedHash, callback) {
    fetch(scriptName)
      .then(response => response.text())
      .then(text => {
        const actualHash = getHash(text);
        if (actualHash != expectedHash)
          callback(false);
        else
          callback(true);
      });
  }

  function init(config) {
    let tampered = false;
    // Check DOM element(s)
    (config.criticalElements || []).forEach(selector => {
      const el = document.querySelector(selector);
      if (el) {
        const orig = el.innerHTML;
        setInterval(() => {
          if (!checkElementIntegrity(selector, orig)) {
            tampered = true;
            alert('Tampering detected: Critical element modified!');
          }
        }, 1000);
      }
    });

    // Check script integrity
    if (config.scriptHashes) {
      Object.keys(config.scriptHashes).forEach(name => {
        checkScriptIntegrity(name, config.scriptHashes[name], valid => {
          if (!valid) {
            tampered = true;
            alert('Tampering detected: Script hash mismatch!');
          }
        });
      });
    }
  }

  return { init };
})();
