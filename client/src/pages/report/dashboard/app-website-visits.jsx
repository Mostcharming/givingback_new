import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Select from 'react-select';
import Chart, { useChart } from './chart';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

export default function AppWebsiteVisits({
  title,
  subheader,
  chart,
  ...other
}) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map((i) => i.fill),
    },
    labels,
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return formatCurrency(value);
          }
          return value;
        },
      },
    },
    ...options,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (selectedFilter) => {
    if (selectedFilter) {
      setFilter(selectedFilter);
    }
    setAnchorEl(null);
  };

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const projectOptions = [{ value: 'project1', label: 'Project 1' }];

  const areaOptions = [{ value: 'area1', label: 'Thematic Area 1' }];

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Select
              options={projectOptions}
              value={selectedProject}
              onChange={setSelectedProject}
              placeholder='Select a Project'
              isSearchable
              styles={{ container: (base) => ({ ...base, width: 200 }) }}
            />
            <Select
              options={areaOptions}
              value={selectedArea}
              onChange={setSelectedArea}
              placeholder='Select an Area'
              isSearchable
              styles={{ container: (base) => ({ ...base, width: 200 }) }}
            />
          </div>
        }
      />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir='ltr'
          type='line'
          series={series}
          options={chartOptions}
          width='100%'
          height={364}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
