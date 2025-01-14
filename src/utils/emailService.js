const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const compileTemplate = (templateName, data) => {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    const compiled = handlebars.compile(template);
    return compiled({
        ...data,
        currentYear: new Date().getFullYear(),
        portalUrl: process.env.PORTAL_URL || 'https://yourwebsite.com'
    });
};

module.exports = {
    compileTemplate
};
