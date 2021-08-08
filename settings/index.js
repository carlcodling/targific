const colorSet = [
  {color: '#ffffff'},
  {color: '#cccccc'},
  {color: '#999999'},
  {color: '#e91e63'},
  {color: '#9c27b0'},
  {color: '#673ab7'},
  {color: '#536dfe'},
  {color: '#3f51b5'},
  {color: '#2196f3'},
  {color: '#03a9f4'},
  {color: '#00bcd4'},
  {color: '#00796b'},
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

const options = [
  ['Calories Colour', 'colorCalories'],
  ['Steps Colour', 'colorSteps'],
  ['Distance Colour', 'colorDistance'],
  ['Active Zone Colour', 'colorAZ'],
  ['Elevation Gain Colour', 'colorFloors']
];

function mySettings(props) {
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
      {options.map(([title, settingsKey]) =>
        <Section
          title={title}>
          <ColorSelect
            settingsKey={settingsKey}
            colors={colorSet} />
        </Section>
      )}
    </Page>
  );
}

registerSettingsPage(mySettings);