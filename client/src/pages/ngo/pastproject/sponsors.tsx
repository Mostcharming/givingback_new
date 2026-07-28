import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import upload from "../../../assets/images/upload.svg";
import FileUplaod from "../../../components/file_upload";
import { usePastProjectContext } from "../add-past-project-context";

const Sponsors = ({ changePage, edit }) => {
  const { pastProjects, addPastProject } = usePastProjectContext();
  const [image, setImage] = useState<File | undefined>(undefined);
  const [images, setImages] = useState<{ name: string; file: File }[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [project, setProject] = useState<any>();

  useEffect(() => {
    async function fetchProject() {}
    if (edit) {
      fetchProject();
    }
  }, [setProject]);

  const onSelected = (file: File, sponsor) => {
    setImages((prevImages) => {
      const updatedImages = prevImages.map((image) => {
        if (image.name === sponsor.name) {
          // Replace the existing image with the new file
          return { name: sponsor.name, file: file };
        }
        return image;
      });

      // If the image with the given name doesn't exist, add it to the array
      if (!updatedImages.some((image) => image.name === sponsor.name)) {
        updatedImages.push({ name: sponsor.name, file: file });
      }

      return updatedImages;
    });
  };

  const add = () => {
    let init = [...sponsors];
    init.push({
      name: `Sponsor ${init.length + 1}`,
      file: `Logo ${init.length + 1}`,
      description: `Description ${init.length + 1}`,
    });
    setSponsors(init);
  };

  const handleSubmit = async (event: React.UIEvent<HTMLFormElement>) => {
    event.preventDefault();

    for (let i = 0; i < sponsors.length; i++) {
      let name = event.currentTarget[`${sponsors[i].name}`].value;
      let image = images[i];
      let description = event.currentTarget[`${sponsors[i].description}`].value;

      let nameKey = `sponsors[${i}][name]`;
      let imageKey = `sponsors[${i}][image]`;
      let descriptionKey = `sponsors[${i}][sponsorDescription]`;

      addPastProject({
        [nameKey]: name,
        [imageKey]: image.file,
        [descriptionKey]: description,
      });
    }

    changePage("Next");
  };

  const back = () => changePage("Back");

  return (
    <div className="bg-white p-4">
      {edit && (
        <>
          <Row>
            <Col lg={12}>
              <Form.Group className="mb-4" style={{ textAlign: "left" }}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  defaultValue={project?.sponsor.name}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Form.Group className="mb-4" style={{ textAlign: "left" }}>
                <Form.Label>About the sponsor</Form.Label>
                <Form.Control
                  required
                  type="text"
                  defaultValue={project?.sponsor.about}
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg="12">
            {sponsors.map((sponsor) => {
              return (
                <div key={sponsor.name}>
                  <Row>
                    <Col lg={7}>
                      <Form.Group
                        className="mb-4"
                        style={{ textAlign: "left" }}
                        controlId={sponsor.name}
                      >
                        <Form.Label>{sponsor.name}</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="Enter Name of Sponsor"
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={5}>
                      <Form.Group
                        className="mb-4"
                        style={{ textAlign: "left" }}
                        controlId={sponsor.file}
                      >
                        <Form.Label>Logo of Sponsor</Form.Label>
                        <FileUplaod
                          className="mb-4"
                          file={image}
                          width="200px"
                          height="40px"
                          onFile={(file: File) => onSelected(file, sponsor)}
                          backgroundColor="white"
                        >
                          <img src={upload} alt="upload icon" width="25px" />
                          <label
                            className="text-center mb-2 mx-1"
                            style={{ fontSize: "13px" }}
                          >
                            Upload Image
                          </label>
                        </FileUplaod>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Form.Group
                        className="mb-4"
                        style={{ textAlign: "left" }}
                        controlId={sponsor.description}
                      >
                        <Form.Label>What they do</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          placeholder="Enter short description of what they do"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </Col>
          <Col lg="12">
            <Button
              className="px-3 text-white"
              style={{ background: "#7B80DD" }}
              type="button"
              onClick={add}
            >
              {"\u002B Add Another Sponsor"}
            </Button>
            <div style={{ float: "right" }}>
              <Button
                className=" px-3 me-3 text-white"
                style={{ background: "#7B80DD" }}
                onClick={back}
                type="button"
              >
                Back
              </Button>
              <Button
                className="px-3 text-white"
                type="submit"
                style={{ background: "#7B80DD" }}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Sponsors;
