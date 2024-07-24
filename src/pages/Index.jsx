import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Papa from "papaparse";

const Index = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        setHeaders(result.data[0]);
        setCsvData(result.data.slice(1));
      },
      header: false,
    });
  };

  const handleDownload = () => {
    const csv = Papa.unparse([headers, ...csvData]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "edited_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAddRow = () => {
    setCsvData([...csvData, Array(headers.length).fill("")]);
  };

  const handleDeleteRow = (index) => {
    const newData = [...csvData];
    newData.splice(index, 1);
    setCsvData(newData);
  };

  const handleEditCell = (rowIndex, cellIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][cellIndex] = value;
    setCsvData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Management Tool</h1>
      <p className="mb-4">Upload, Edit, and Download CSV Files</p>

      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      {csvData.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Input
                          value={cell}
                          onChange={(e) =>
                            handleEditCell(rowIndex, cellIndex, e.target.value)
                          }
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteRow(rowIndex)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 space-x-4">
            <Button onClick={handleAddRow}>Add Row</Button>
            <Button onClick={handleDownload}>Download CSV</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;