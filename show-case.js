var dojoEnabledToggleButton = document.getElementById('dojoEnabledToggleButton');
var dojoDisabledToggleButton = document.getElementById('dojoDisabledToggleButton');
var dojoDialogButton = document.getElementById('dojoDialogButton');

// Main Tool Bar
dojoToolbar.collapseWidth = 700;
dojoToolbar.fixed = true;
dojoToolbar.menuTitle = 'Menu';
dojoToolbar.title = 'Dojo 2 Widget Showcase';

// Split Pane
dojoSplitPane.size = 500;
dojoSplitPane.addEventListener('resize', function (event) {
	dojoSplitPane.size = event.detail[0];
});

// Accordian
var titlePanesOpen = [];
dojoAccordianPane.addEventListener('requestopen', function (event) {
	var openKey = event.detail[0];
	var keyIndex = titlePanesOpen.indexOf(openKey);
	if (keyIndex === -1) {
		titlePanesOpen.push(openKey);
	}
	dojoAccordianPane.openKeys = titlePanesOpen;
});
dojoAccordianPane.addEventListener('requestclose', function (event) {
	var openKey = event.detail[0];
	var keyIndex = titlePanesOpen.indexOf(openKey);
	if (keyIndex !== -1) {
		titlePanesOpen.splice(keyIndex, 1);
	}
	dojoAccordianPane.openKeys = titlePanesOpen;
});

// Theme
var themes = Object.keys(window.dojoce.themes);
var currentTheme = window.dojoce.theme;
var currentRadio;
themes.forEach(function(theme) {
	var radio = document.createElement('dojo-radio');
	radio.checked = theme === currentTheme;
	if (radio.checked) {
		currentRadio = radio;
	}
	radio.addEventListener('change', function (event) {
		window.dojoce.theme = event.detail[0].target.value;
		currentRadio.checked = false;
		radio.checked = true;
		currentRadio = radio;
	});
	radio.setAttribute('label', theme);
	radio.setAttribute('value', theme);
	themePane.appendChild(radio);

});

// Calendar
dojoCalendar.selectedDate = new Date();
dojoCalendarLabel.setAttribute('label', dojoCalendar.selectedDate.toDateString());
dojoCalendar.addEventListener('monthchange', function (event) {
	dojoCalendar.month = event.detail[0];
});
dojoCalendar.addEventListener('yearchange', function (event) {
	dojoCalendar.year = event.detail[0];
});
dojoCalendar.addEventListener('dateselect', function (event) {
	dojoCalendar.selectedDate = event.detail[0];
	dojoCalendarLabel.setAttribute('label', dojoCalendar.selectedDate.toDateString());
});

// Dialog
dojoDialog.modal = true;
dojoDialog.underlay = true;
dojoDialog.closeable = true;
dojoDialog.open = false;
dojoDialogButton.addEventListener('click', function() {
	dojoDialog.open = true;
});
dojoDialog.addEventListener('requestclose', function() {
	dojoDialog.open = false;
});

// Tab Controller
dojoTabController.activeIndex = 0;
dojoTabController.addEventListener('requesttabchange', function (event) {
	dojoTabController.activeIndex = event.detail[0];
});

// Basic Form Widgets
dojoTabBasic.label = "Basic Form Widgets";

// Buttons
dojoEnabledPopupButton.popup = {
	expanded: false,
	id: 'dojoPopupButton'
};
dojoEnabledToggleButton.pressed = false;
dojoEnabledToggleButton.addEventListener('click', function(event) {
	dojoEnabledToggleButton.pressed = !dojoEnabledToggleButton.pressed;
});

dojoDisabledBasicButton.disabled = true;
dojoDisabledIconButton.disabled = true;
dojoDisabledPopupButton.popup = {
	expanded: false,
	id: 'dojoPopupButton'
};
dojoDisabledPopupButton.disabled = true;
dojoDisabledToggleButton.pressed = false;
dojoDisabledToggleButton.disabled = true;
dojoDisabledToggleButton.addEventListener('click', function(event) {
	dojoDisabledToggleButton.pressed = !dojoDisabledToggleButton.pressed;
});

// Checkbox
dojoCheckedCheckbox.checked = true;
var counter = 0;
dojoCheckedCheckbox.addEventListener('change', function() {
	if (counter === 0) {
		dojoCheckedCheckbox.checked = !dojoCheckedCheckbox.checked;
		counter++;
	}
	else {
		counter = 0;
	}
});
dojoDisabledCheckedCheckbox.checked = true;
dojoDisabledCheckedCheckbox.disabled = true;
dojoDisabledUnCheckedCheckbox.disabled = true;

// Text Input Widgets
dojoTabInputs.label = "Text Input Widgets";
dojoRequiredTextInput.required = true;
dojoDisabledTextInput.value = "Initial Value";
dojoDisabledTextInput.disabled = true;
dojoDisabledTextInput.readOnly = true;

dojoTwitterEnhancedInput.addonBefore = [ '@' ];
dojoPriceEnhancedInput.addonBefore = [ '$' ];
dojoPriceEnhancedInput.addonAfter = [ '.00' ];

dojoBasicTimePicker.clearable = true;
dojoBasicTimePicker.end = '23:59';
dojoBasicTimePicker.label = 'Basic Time Picker';
dojoBasicTimePicker.start = '00:00';
dojoBasicTimePicker.step = 1800;
dojoBasicTimePicker.value = '10:30';
dojoBasicTimePicker.options = undefined;
dojoBasicTimePicker.addEventListener('requestoptions', function (value, options) {
	dojoBasicTimePicker.options = options;
});
dojoBasicTimePicker.addEventListener('change', function (value) {
	dojoBasicTimePicker.value = value;
});

// Text Area Widgets
dojoTabTextArea.label = "Text Area";
dojoTextarea.columns = 40;
dojoTextarea.rows = 8;
dojoTextarea.placeholder = 'Hello, World';

dojoDisabledTextarea.columns = 40;
dojoDisabledTextarea.rows = 8;
dojoDisabledTextarea.placeholder = 'Hello, World';
dojoDisabledTextarea.disabled = true;

// Selects
dojoTabSelects.label = "Selects";

dojoSimpleSelect.options = [ 'foo', 'bar', 'baz', 'qux' ];
dojoSimpleDisabledSelect.disabled = true;
dojoSimpleDisabledSelect.options = [ 'foo', 'bar', 'baz', 'qux' ];
dojoNativeSelect.options = [ 'foo', 'bar', 'baz', 'qux' ];
dojoNativeSelect.useNativeElement = true;
dojoDisabledNativeSelect.options = [ 'foo', 'bar', 'baz', 'qux' ];
dojoDisabledNativeSelect.useNativeElement = true;
dojoDisabledNativeSelect.disabled = true;

var animals = [
	{
		value: 'cat',
		label: 'Cat'
	},
	{
		value: 'dog',
		label: 'Dog'
	},
	{
		value: 'hamster',
		label: 'Hamster'
	},
	{
		value: 'goat',
		label: 'Goat',
		disabled: true
	}
];

dojoComplexSelect.options = animals;
dojoComplexSelect.getOptionDisabled = function(option) {
	return option.disabled;
}
dojoComplexSelect.getOptionLabel = function(option) {
	return option.label;
}
dojoComplexSelect.getOptionValue = function(option) {
	return option.value;
}

dojoComplexNativeSelect.useNativeElement = true;
dojoComplexNativeSelect.options = animals;
dojoComplexNativeSelect.getOptionDisabled = function(option) {
	return option.disabled;
}
dojoComplexNativeSelect.getOptionLabel = function(option) {
	return option.label;
}
dojoComplexNativeSelect.getOptionValue = function(option) {
	return option.value;
}

// Progress
dojoTabProgress.label = "Progress";

dojoProgress.value = 50;
dojoProgressMaxOne.value = 0.3;
dojoProgressMaxOne.max = 1;
dojoProgressCustomOutput.value = 250;
dojoProgressCustomOutput.max = 750;
dojoProgressCustomOutput.output = function(value, percent) {
	return value + ' of 750 is ' + percent;
}
dojoProgressNoOutput.value = 10;
dojoProgressNoOutput.showOutput = false;

// Sliders
dojoTabSlider.label = "Slider";

dojoSlider.min = 0;
dojoSlider.max = 100;
dojoSlider.step = 1;
dojoSlider.output = function(value) {
	if (value < 20) { return 'I am a Klingon'; }
	if (value < 40) { return 'Tribbles only cause trouble'; }
	if (value < 60) { return 'They\`re kind of cute'; }
	if (value < 80) { return 'Most of my salary goes to tribble food'; }
	else { return 'I permanently altered the ecology of a planet for my tribbles'; }
}
dojoSlider.value = 50;
dojoSlider.addEventListener('input', function(event) {
	dojoSlider.value = event.detail[0].target.value;
});
dojoDisabledSlider.min = 0;
dojoDisabledSlider.max = 100;
dojoDisabledSlider.step = 1;
dojoDisabledSlider.value = 30;
dojoDisabledSlider.disabled = true;
dojoVerticalSlider.value = 0;
dojoVerticalSlider.vertical = true;
dojoVerticalSlider.invalid = false;
dojoVerticalSlider.outputIsTooltip = true;
dojoVerticalSlider.output = function (value) {
	return dojoVerticalSlider.invalid ? value.toString() + '!' : value.toString();
}
dojoVerticalSlider.addEventListener('input', function(event) {
	var val = event.detail[0].target.value;
	dojoVerticalSlider.invalid = val > 50;
	dojoVerticalSlider.value = val;
});
