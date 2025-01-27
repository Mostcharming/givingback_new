import { Col, Container, Form, Row } from "react-bootstrap";
import { useRef, useState } from "react";
import ProgressHeader from "../../ngo/progress-header";
import { useBriefContext } from "../add-brief-context";
import AddBriefRow from "./add-brief-row";

const ProjectMilestones = ({ page, headers, changePage }) => {
  const { brief, addToBrief } = useBriefContext();
  const formRef = useRef(null); 
  const [milestones, setMilestones] = useState<{milestone: string, target: number}[]>([]);


  const columns = [
    { label: "Milestone", width: 9 },
    { label: "Target", width: 3 },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const milestone = e.currentTarget.milestones.value;
    const target = e.currentTarget.milestoneTarget.value;

    console.log(milestone);

    const init = [...milestones];
    init.push({
        milestone,
        target,
    });
    setMilestones(init);

     // Reset the form
     if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleNext = () => {

    for (let i = 0; i < milestones.length; i++) {
      let milestone = milestones[i].milestone;
      let target  = milestones[i].target;

      let mileStoneKey = `milestones[${i}][milestone]`;
      let targetKey = `milestones[${i}][target]`;
      

      console.log(mileStoneKey, milestone);
      console.log(targetKey, target);

      addToBrief({
        [mileStoneKey]: milestone,
        [targetKey]: target
      });

      console.log(brief);

    }
    changePage("Next");
  };

  return (
    <>
      <Container className="mt-3 admin-container w-75">
        <ProgressHeader page={page} headers={headers} />

        <Form ref={formRef} className="mt-5 mx-5" id="form" onSubmit={handleSubmit}>
          <Row>
            <Col lg="9">
              <Form.Group className="mb-4" style={{ textAlign: "left" }} controlId="milestones">
                <Form.Label>List out the Milestones</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
            <Col lg="3">
              <Form.Group className="mb-3" style={{ textAlign: "left" }} controlId="milestoneTarget">
                <Form.Label>Target</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <button className="btn-modal-back mb-5">Back to Beneficiaries</button>
            </Col>
            <Col lg="6">
              <button className="btn-modal mb-5">Add to Brief</button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className="w-75 mt-4">
        <AddBriefRow data={milestones} columns={columns} />
        <button className="btn-modal mt-5 px-0 mx-0" onClick={handleNext}>Proceed to Executors</button>
      </Container>
    </>
  );
};
export default ProjectMilestones;
