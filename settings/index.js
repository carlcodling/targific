import {themes} from "./themes"

const activityColorSet = [
  {color: '#ffffff'},
  {color: '#bdbdbd'},
  {color: '#e91e63'},
  {color: '#9c27b0'},
  {color: '#673ab7'},
  {color: '#3f51b5'},
  {color: '#2196f3'},
  {color: '#03a9f4'},
  {color: '#00bcd4'},
  {color: '#009688'},
  {color: '#4caf50'},
  {color: '#8bc34a'},
  {color: '#cddc39'},
  {color: '#ffeb3b'},
  {color: '#ffc107'},
  {color: '#ff9800'},
  {color: '#ff5722'},
  {color: '#f44336'}
];
const fgColorSet = [
  {color: '#ffffff'},
  {color: '#dedede'},
  {color: '#f8bbd0'},
  {color: '#e1bee7'},
  {color: '#d1c4e9'},
  {color: '#c5cae9'},
  {color: '#bbdefb'},
  {color: '#b3e5fc'},
  {color: '#b2ebf2'},
  {color: '#b2dfdb'},
  {color: '#c8e6c9'},
  {color: '#dcedc8'},
  {color: '#f0f4c3'},
  {color: '#fff9c4'},
  {color: '#ffecb3'},
  {color: '#ffe0b2'},
  {color: '#ffccbc'},
  {color: '#ffcdd2'}
];

const options = [
  ['Calories Colour', 'colorCalories'],
  ['Steps Colour', 'colorSteps'],
  ['Distance Colour', 'colorDistance'],
  ['Active Zone Colour', 'colorAZ'],
  ['Elevation Gain Colour', 'colorFloors']
];

function getThemeTitleList(){
  let a = []
  themes.forEach(function(v, i){
    a[i] = {name:v.name, value:i}
  })
  return a;
}
let themeTitles = getThemeTitleList();

function mySettings(props) {
  function setTheme(n){
    let vals = themes[n]["values"];
    for (const key in vals) {
      props.settingsStorage.setItem(key, JSON.stringify(vals[key]));
    }
  }
  return (
    <Page>
      <Section
        title={<Text bold align="center">Display options</Text>}>
        <Select
          label={`Date Format`}
          settingsKey="df"
          options={[
            {name:"None", value:"0"},
            {name:"Short [Jan 01]", value:"1"},
            {name:"Medium [January 01]", value:"2"},
            {name:"Long [Mon January 01]", value:"3"}
          ]}
        onSelection={(selection) => props.settingsStorage.setItem('dateFormat', selection.values[0].value)}
        />

        <Toggle
          settingsKey="displaySeconds"
          label="Show seconds?"
        />
        <Toggle
          settingsKey="displayHR"
          label="Show heart rate?"
        />
        <Toggle
          settingsKey="displayBattery"
          label="Show battery?"
        />

      </Section>
      <Section
        title={<Text bold align="center">Theme Settings</Text>}>
        <Text>
          Select a preconfigured theme or build your own using the various options below.
        </Text>
        <Text>
          <Text  italic>* Tip: Start with a preconfigured theme and then make minor adjustments.</Text>
        </Text>

      </Section>
      <Select
        label={`Theme`}
        settingsKey="theme"
        options={themeTitles}
        onSelection={(selection) => setTheme(selection.selected)}
      />
      <Slider
        label="Glow"
        settingsKey="glow"
        min="0"
        max="3"
      />
      <Section
        title={`Clock Colour`}>
        <ColorSelect
          settingsKey="colorClock"
          colors={fgColorSet}
          onSelection={(value) => props.settingsStorage.removeItem("theme")}
        />
      </Section>
      {options.map(([title, settingsKey]) =>
        <Section
          title={title}>
          <ColorSelect
            settingsKey={settingsKey}
            colors={activityColorSet}
            onSelection={(value) => props.settingsStorage.removeItem("theme")} />
        </Section>
      )}

    </Page>
  );
}

registerSettingsPage(mySettings);
