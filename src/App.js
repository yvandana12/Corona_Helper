import React, { useEffect,useState } from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import Infobox from './Infobox';
import Map from './Map';
import Table from './Table';
import './App.css';
import { sortData, prettyPrintStat } from "./util";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries,setCountries]=useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter, setMapCenter] = useState({lat:34.80746, lng:-40.4796});
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries]= useState([]);
  const [casesType, setCasesType] = useState("cases");
  //https://disease.sh/v3/covid-19/countries
  //USEEFFECT= runs a piece of code based on a given condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {
    const getCountriesData=async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country, //United States
            value:country.countryInfo.iso2, //UK,USA,IND
          }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    
    getCountriesData();
  }, []);

  const onCountryChange=  async (event) =>{
    const countryCode=event.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setZoom(4);
    });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header" >
        <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* Loop through all the countries and show
              a drop down list of all countries */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country=>(
                <MenuItem value={country.value}>{country.name}</MenuItem>))
              }
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
          <Infobox  active={casesType === "cases"} onClick={(e)=>setCasesType("cases")} title="coronavirus cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <Infobox active={casesType === "recovered"} onClick={(e)=>setCasesType("recovered")} title="recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <Infobox active={casesType === "deaths"} onClick={(e)=>setCasesType("deaths")} title="deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

         <Map 
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={zoom}/> 
        
      </div>
      <Card className="app__right">
        <CardContent>          
          <h3>Live cases by Country</h3>
          <Table countries={tableData}/>
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType}/>
          
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
