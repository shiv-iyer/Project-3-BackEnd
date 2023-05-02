// Forms module to use forms. We will be using Caolan Forms

// import in Caolan Forms
const forms = require("forms");

// create shortcuts
const fields = forms.fields;
const validators = forms.validators;
// widgets for select etc.
const widgets = forms.widgets;

// utilize Bootstrap to format the forms, enabling them to use Bootstrap's CSS classes
var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// function to create a card using Caolan Forms!
const createCardForm = (expansions, types) => {
    return forms.create({
        // one field for each columm in the table. Excluding ID, which will be assigned by default I presume
        'name': fields.string({
            required: validators.required("Please enter a name for your card!"),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            // try validating for max length, doesn't seem to work...
            'valdiators': [validators.maxlength(5, "Your card's name cannot exceed 5 characters!")]
        }),
        'rarity': fields.string({
            required: validators.required("Please enter your card's rarity!"),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'format': fields.string({
            required: validators.required("Please enter the format your card is played in!"),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'condition': fields.string({
            required: validators.required("Please enter the condition of your card!"),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'cost': fields.string({
            required: validators.required("Please enter the cost of your card (in $ / dollars)!"),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            // validators: to validate inputs, in this case to ensure an integer is input
            // all validators available here: https://github.com/caolan/forms
            'validators': [validators.integer()]
        }),
        'stage': fields.string({
            required: validators.required("Please enter your card's current stage!"),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'hit_points': fields.string({
            required: validators.required("Please enter your card's HP!"),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'flavor_text': fields.string({
            required: validators.required("Please enter your card's flavor text!"),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'types': fields.string({
            // label is to rename the field on the UI
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            // multipleSelect for many to many
            widget: widgets.multipleSelect(),
            // choices for the widget aka the select: expansions that we passed in to the form
            choices: types
        }),
        // adding the expansion ID, just use the column name
        'expansion_id': fields.string({
            // label is to rename the field on the UI
            label: 'Expansion',
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            // widget for select
            widget: widgets.select(),
            // choices for the widget aka the select: expansions that we passed in to the form
            choices: expansions
        })


        // 'image_url': fields.string({
        //     required: validators.required("Please enter an image URL for your card!"),
        //     errorAfterField: true,
        //     cssClasses: {
        //         label: ['form-label']
        //     },
        //     'validators': [validators.url()]
        // }),
        // 'thumbnail_url': fields.string({
        //     required: validators.required("Please enter a thumbnail URL for your card!"),
        //     errorAfterField: true,
        //     cssClasses: {
        //         label: ['form-label']
        //     },
        //     'validators': [validators.url()]
        // })
    });
};

const createRegistrationForm = () => {
    return forms.create({
        'first_name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'last_name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'username': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'contact_number': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
    })
};

module.exports = { createCardForm, createRegistrationForm, bootstrapField };