import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Slider,
  Typography,
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { fetchPolicies } from "../common/api";
import "./InsuranceSearch.css";
import { Policy } from "./model";

export default function InsuranceSearch() {
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [premiumRange, setPremiumRange] = useState<number[]>([0, 10000]);
  const [minCoverage, setMinCoverage] = useState<number>(0);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (type: string) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const getPolicies = async () => {
    setLoading(true);
    const result = await fetchPolicies({
      name: search || undefined,
      minPremium: premiumRange[0],
      maxPremium: premiumRange[1],
      types: types.length > 0 ? types : undefined,
      minCoverage: minCoverage || undefined,
    });
    setPolicies(result);
    setLoading(false);
  };

  useEffect(() => {
    getPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="container">
      {/* Filters Section */}
      <Box className="filters-section">
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={types.includes("Health")} onChange={() => handleTypeChange("Health")} />}
            label="Health"
          />
          <FormControlLabel
            control={<Checkbox checked={types.includes("Vehicle")} onChange={() => handleTypeChange("Vehicle")} />}
            label="Vehicle"
          />
          <FormControlLabel
            control={<Checkbox checked={types.includes("Term Life")} onChange={() => handleTypeChange("Term Life")} />}
            label="Term Life"
          />
        </FormGroup>
        <Box className="slider-section">
          <Typography gutterBottom>Premium: {premiumRange[0]} - {premiumRange[1]}</Typography>
          <Slider
            value={premiumRange}
            onChange={(_, newValue) => setPremiumRange(newValue as number[])}
            min={0}
            max={10000}
            step={100}
            valueLabelDisplay="auto"
          />
        </Box>
        <TextField
          label="Min Coverage"
          type="number"
          variant="outlined"
          value={minCoverage}
          onChange={(e) => setMinCoverage(Number(e.target.value))}
          fullWidth
          className="min-coverage"
        />
        <Button variant="contained" onClick={getPolicies} fullWidth className="filter-button">Filter</Button>
      </Box>

      {/* Results Section */}
      <Box className="results-section">
        <Box className="search-box">
          <TextField
            label="Search policy"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={getPolicies}>Search</Button>
        </Box>
        <Card className="results-card">
          {loading ? (
            <Box className="loading-container">
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>Loading...</Typography>
            </Box>
          ) : policies.length === 0 ? (
            <Box className="no-data-container">
              <Typography variant="h6">No data found</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Premium</strong></TableCell>
                  <TableCell><strong>Coverage</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id} className="policy-row">
                    <TableCell>{policy.name}</TableCell>
                    <TableCell>{policy.type}</TableCell>
                    <TableCell>{policy.premium}</TableCell>
                    <TableCell>{policy.coverageAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Box>
    </Box>
  );
}
