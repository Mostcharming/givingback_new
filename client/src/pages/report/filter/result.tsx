import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './index.css';
import * as XLSX from 'xlsx';

function ResultsModal({ show, handleClose, data }) {



    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
        XLSX.writeFile(workbook, "FilteredData.xlsx");
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            className="custom-modal"
            size="lg"
            centered
        >
            <Modal.Body className="modal-body">
                <div className="table-container">
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>State</th>
                                <th>Local Govt</th>
                                <th>Community</th>
                                <th>Donor</th>
                                <th>Project</th>
                                <th>No of Projects</th>
                                <th>NGO</th>
                                <th>Funding</th>
                                <th>Beneficiaries</th>
                                <th>Gender</th>
                                <th>Ethicity/Race</th>
                                <th>Frequency</th>
                                <th>Duration (mo)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.State}</td>
                                        <td>{row.LocalGovt}</td>
                                        <td>{row.Community}</td>
                                        <td>{row.Donor}</td>
                                        <td>{row.Project}</td>
                                        <td>{row.NoOfProjects}</td>
                                        <td>{row.NGO}</td>
                                        <td>{row.Funding}</td>
                                        <td>{row.Beneficiaries}</td>
                                        <td>{row.Gender}</td>
                                        <td>{row.EthnicityRace}</td>
                                        <td>{row.Frequency}</td>
                                        <td>{row.Duration}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button style={{ background: '#6c72d9' }} onClick={handleDownload}>
                    Download to Excel
                </Button>
            </Modal.Footer>
        </Modal >
    );
}

export default ResultsModal;
