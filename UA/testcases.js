
function isValidEmail(email) {
    try {
        const asciiEmail = punycode.toASCII(email);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(asciiEmail);
    } catch {
        return false;
    }
}


const testCases = [
    { email: "test@example.com", expected: true },
    { email: "ユーザー@例え.テスト", expected: true }, // Japanese IDN
    { email: "مستخدم@مثال.إختبار", expected: true }, // Arabic IDN
    { email: "юзер@пример.рф", expected: true }, // Russian IDN
    { email: "invalid@domain", expected: false },
    { email: "missingatsign.com", expected: false },
    { email: "name@.com", expected: false },
    { email: "@nouser.com", expected: false },
    { email: "emoji😊@mail.com", expected: false },
    { email: "user@-domain.com", expected: false },
];

console.log("🔍 Running Email Validation Test Cases...\n");

let passed = 0;
testCases.forEach(({ email, expected }, index) => {
    const result = isValidEmail(email);
    const status = result === expected ? "✅ Pass" : "❌ Fail";
    if (result === expected) passed++;
    console.log(`${index + 1}. ${email} => ${result} (${status})`);
});

console.log(`\n✅ Passed ${passed} / ${testCases.length} test cases.`);
