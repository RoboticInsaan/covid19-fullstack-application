import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NumberFormat from 'react-number-format';
import { OrbitSpinner } from 'react-epic-spinners';
import FlatList from 'flatlist-react';

import {
  fetchCoronaStatistics,
  showCountryStatistics,
  setMapStyle,
  setAction,
} from '../../actions';
import { MAP_STYLE_ACTION, MAP_FLY_ACTION } from '../../actions/constants';

const CoronaStatisticsContainer = () => {
  const dispatch = useDispatch();
  const statisticsData = useSelector((state) => state.statistics);

  const [isLoading, setIsLoading] = useState(false);
  const [isAboutModal, setIsAboutModal] = useState(false);
  const [isSelected, setIsSelected] = useState(-1);
  const [tabMenuSelect, setTabMenuSelect] = useState(1);
  const [tabSelectedtPos, setTabSelectedtPos] = useState(-1);
  const [statistics, setStatistics] = useState([]);
  const [matches] = useState(window.matchMedia("(min-width: 1000px)").matches);

  const filterStatistics = React.useRef([]);

  useEffect(() => {
    dispatch(fetchCoronaStatistics());
  }, [dispatch]);

  const showCountryStatistics = (item, index) => {
    setIsSelected(index);
    if (!matches) {
      setTabSelectedtPos(2);
      setTabMenuSelect(2);
    }
    dispatch(setAction(MAP_FLY_ACTION));
    dispatch(showCountryStatistics(item.coordinates));
  };

  const onTabSelection = (index) => {
    setTabSelectedtPos(index);
    setTabMenuSelect(index);
    setIsAboutModal(index === 3);
  };

  const onSetMapStyle = (mapStyle) => {
    dispatch(setAction(MAP_STYLE_ACTION));
    dispatch(setMapStyle(mapStyle));
  };

  const searchCountry = (event) => {
    const keyword = event.target.value.toUpperCase();
    const filtered = filterStatistics.current.filter((item) =>
      item.country.toUpperCase().includes(keyword)
    );
    setStatistics(filtered);
  };

  const renderStatistics = () => {
    const data = statisticsData.results;
    if (!data) return null;

    const { total_confirmed, total_deaths, total_recovered, last_date_updated, country_statistics } = data;

    if (country_statistics && !isLoading) {
      filterStatistics.current = country_statistics;
      setStatistics(country_statistics);
      setIsLoading(true);
    }

    return (
      <div className="list-container">
        {/* Header Section */}
        <div className="header-container">
          <div className="covid-label-container">
            <p className="covid-label">Coronavirus (COVID-19) Tracker</p>
            {/* Description */}
            <p className="covid-desc-txt">
              To get up-to-date results, this website collects data from&nbsp;
              <a
                href="https://github.com/CSSEGISandData/COVID-19"
                target="_blank"
                rel="noopener noreferrer"
                className="covid-desc-link-txt"
              >
                Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)
              </a>
              .
            </p>
          </div>
          {/* Date */}
          <div className="covid-date-container">
            <span className="covid-timeline-label">Last Updated:</span>
            <span className="covid-timeline">{last_date_updated}</span>
          </div>
          {/* Total Statistics */}
          <div className="total-statistics-container">
            <div className="dr-container">
              <NumberFormat value={total_confirmed} displayType="text" thousandSeparator />
              <span>CONFIRMED</span>
            </div>
            <div className="dr-container">
              <NumberFormat value={total_deaths} displayType="text" thousandSeparator />
              <span>DEATHS</span>
            </div>
            <div className="dr-container">
              <NumberFormat value={total_recovered} displayType="text" thousandSeparator />
              <span>RECOVERED</span>
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <div className="search-container">
          <input type="text" placeholder="Search country" onChange={searchCountry} />
        </div>
        {/* Country Statistics */}
        {isLoading ? (
          <FlatList list={statistics} renderItem={renderItem} />
        ) : (
          <div className="progress-loading-container">
            <OrbitSpinner color="black" size={60} />
            <p>Please wait...</p>
          </div>
        )}
      </div>
    );
  };

  const renderItem = (item, index) => (
    <div
      key={item.country}
      className={`country-statistics-container ${isSelected === index ? "selected" : ""}`}
      onClick={() => showCountryStatistics(item, index)}
    >
      <div>
        <img src={item.flag} alt={item.country} />
        <span>{item.country}</span>
      </div>
      <NumberFormat value={item.confirmed} displayType="text" thousandSeparator />
    </div>
  );

  return (
    <div>
      {renderStatistics()}
      {/* About Modal */}
      {isAboutModal && <div>About Section</div>}
    </div>
  );
};

export default CoronaStatisticsContainer;
