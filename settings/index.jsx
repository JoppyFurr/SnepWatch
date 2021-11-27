/*
 * SnepWatch - Settings
 * JoppyFurr 2021
 */
let colour_list = [
    {color: 'crimson'},
    {color: 'darkred'},
    {color: 'red'},
    {color: 'yellow'},
    {color: 'yellowgreen'},
    {color: 'darkgreen'},
    {color: 'green'},
    {color: 'royalblue'},
    {color: 'navy'},
    {color: 'mediumblue'},
    {color: 'blue'},
    {color: 'violet'},
    {color: 'blueviolet'},
    {color: 'indigo'},
    {color: 'black'},
    {color: 'white'} ]

function snepWatchSettings (porps) {
    return (
      <Page>
        <Section title="Time Fill">
          <ColorSelect settingsKey="fill_colour" colors={colour_list} />
        </Section>
        <Section title="Time Outline">
          <ColorSelect settingsKey="outline_colour" colors={colour_list} />
        </Section>
      </Page>
    )
}

registerSettingsPage (snepWatchSettings)
