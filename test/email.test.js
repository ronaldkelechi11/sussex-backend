const assert = require('assert');
const { compileTemplate } = require('../src/utils/emailService');
const { validateEmail, getFormattedFromAddress } = require('../src/services/emailService');

async function runTests() {
    console.log('--- Running Email Service & Template Tests ---');

    // Test 1: validateEmail utility
    assert.strictEqual(validateEmail('test@example.com'), true);
    assert.strictEqual(validateEmail('invalid-email'), false);
    assert.strictEqual(validateEmail(''), false);
    console.log('✔ validateEmail tests passed');

    // Test 1b: getFormattedFromAddress formatting and fallback
    const savedEnv = { ...process.env };

    // Scenario A: No env vars set -> fallback
    delete process.env.RESEND_FROM_EMAIL;
    delete process.env.FROM_EMAIL;
    delete process.env.SMTP_USER;
    delete process.env.EMAIL_USER;
    delete process.env.SENDER_NAME;
    assert.strictEqual(getFormattedFromAddress(), 'Andre from Sussex Logistics <support@sussexlogistics.xyz>');

    // Scenario B: Plain email address in RESEND_FROM_EMAIL
    process.env.RESEND_FROM_EMAIL = 'orders@sussexlogistics.xyz';
    assert.strictEqual(getFormattedFromAddress(), 'Andre from Sussex Logistics <orders@sussexlogistics.xyz>');

    // Scenario C: Custom SENDER_NAME and plain email
    process.env.SENDER_NAME = 'Sussex Support';
    assert.strictEqual(getFormattedFromAddress(), 'Sussex Support <orders@sussexlogistics.xyz>');

    // Scenario D: Pre-formatted address with name and email
    process.env.RESEND_FROM_EMAIL = 'Custom Logistics <custom@sussexlogistics.xyz>';
    assert.strictEqual(getFormattedFromAddress(), 'Custom Logistics <custom@sussexlogistics.xyz>');

    // Scenario E: Invalid value in env var falls back to fallback email
    process.env.RESEND_FROM_EMAIL = 'invalid-email-string';
    assert.strictEqual(getFormattedFromAddress(), 'Sussex Support <support@sussexlogistics.xyz>');

    // Restore env
    process.env = savedEnv;
    console.log('✔ getFormattedFromAddress tests passed');

    // Test 2: compileTemplate for shipping-notification
    const shippingHtml = compileTemplate('shipping-notification', {
        receiverName: 'Alice Smith',
        trackingId: 'TRK-998877-CARGO',
        currentLocation: 'Distribution Center A',
        expectedDeliveryDate: '2025-06-01',
        typeOfShipment: 'Air Freight',
        carrier: 'Sussex Logistics',
        receiverAddress: '456 Innovation Way',
        receiverEmailAddress: 'alice@example.com',
        senderName: 'Bob Supply Co'
    });

    assert.ok(shippingHtml.includes('Alice Smith'));
    assert.ok(shippingHtml.includes('TRK-998877-CARGO'));
    assert.ok(shippingHtml.includes('Distribution Center A'));
    assert.ok(shippingHtml.includes('Bob Supply Co'));
    console.log('✔ shipping-notification template compilation test passed');

    // Test 3: compileTemplate for package-update
    const updateHtml = compileTemplate('package-update', {
        receiverName: 'Alice Smith',
        trackingId: 'TRK-998877-CARGO',
        statusUpdate: 'Package arrived at regional sorting hub',
        currentLocation: 'Sorting Hub B',
        expectedDeliveryDate: '2025-06-01',
        typeOfShipment: 'Air Freight',
        carrier: 'Sussex Logistics',
        receiverAddress: '456 Innovation Way',
        receiverEmailAddress: 'alice@example.com'
    });

    assert.ok(updateHtml.includes('Alice Smith'));
    assert.ok(updateHtml.includes('TRK-998877-CARGO'));
    assert.ok(updateHtml.includes('Package arrived at regional sorting hub'));
    assert.ok(updateHtml.includes('Sorting Hub B'));
    console.log('✔ package-update template compilation test passed');

    console.log('All email service & template tests completed successfully!');
}

runTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
