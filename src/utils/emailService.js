const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const formatStatus = (val) => {
    if (typeof val === 'boolean') {
        return val ? 'intransit' : 'on hold';
    }
    if (typeof val === 'string') {
        const trimmedLower = val.trim().toLowerCase();
        if (trimmedLower === 'true') return 'intransit';
        if (trimmedLower === 'false') return 'on hold';
    }
    return val;
};

const compileTemplate = (templateName, data) => {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.hbs`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    const compiled = handlebars.compile(template);

    const formattedData = { ...data };
    if (formattedData.statusUpdate !== undefined) {
        formattedData.statusUpdate = formatStatus(formattedData.statusUpdate);
    }
    if (formattedData.status !== undefined) {
        formattedData.status = formatStatus(formattedData.status);
    }

    return compiled({
        ...formattedData,
        currentYear: new Date().getFullYear(),
        portalUrl: process.env.PORTAL_URL || 'https://yourwebsite.com'
    });
};

module.exports = {
    compileTemplate
};
