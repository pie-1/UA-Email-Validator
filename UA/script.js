const form = document.getElementById('emailForm');
const emailInput = document.getElementById('email');

function normalizeUnicode(str) {
  return str.normalize('NFC');
}

function isAscii(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

function isValidEmailUnicode(email) {
  try {
    if (typeof email !== 'string') return false;
    if (email.length > 254) return false;
    if (!email.includes('@')) return false;

    const [localPart, domainPartRaw] = email.split('@');
    if (!localPart || !domainPartRaw) return false;
    if (localPart.length > 64) return false;
    if (/^\.|\.$|\.\./.test(localPart)) return false;

    if (
      !/^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+$/i.test(localPart) &&
      !/^[\p{L}\p{N}\p{Pc}\p{M}!#$%&'*+\-/=?^_`{|}~.]+$/u.test(localPart)
    ) {
      return false;
    }

    const domainPart = normalizeUnicode(domainPartRaw);
    const domainASCII = punycode.toASCII(domainPart);

    if (domainASCII.length > 253) return false;
    if (/^\.|\.$|\.\./.test(domainASCII)) return false;

    const labels = domainASCII.split('.');
    if (labels.length < 2) return false;

    for (const label of labels) {
      if (label.length > 63) return false;
      if (!/^[a-zA-Z0-9-]+$/.test(label)) return false;
      if (/^-|-$/.test(label)) return false;
    }

    const tld = labels[labels.length - 1];
    if (tld.length < 2) return false;
    if (/^\d+$/.test(tld)) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(localPart + '@' + domainASCII)) return false;

    return true;
  } catch (error) {
    console.error('Email validation error:', error);
    return false;
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();

  const isValid = isValidEmailUnicode(email);

 
  localStorage.setItem("validatedEmail", email);
  localStorage.setItem("validationStatus", isValid ? "valid" : "invalid");

  
  window.location.href = "result.html";
});
