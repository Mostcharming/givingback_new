/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Carousel,
  CarouselCaption,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
} from "reactstrap";
import Loading from "../../../../components/home/loading";
import useBackendService from "../../../../services/backend_service";

export default function Highlights({ currentState }: any, ...args: any) {
  const [responseData, setResponseData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const items = responseData.map((project: any) => ({
    src:
      project?.projectImages && project.projectImages.length > 0
        ? project.projectImages[0].image
        : "https://picsum.photos/1200/400",
    altText: project?.title || "Project image",
    caption: project?.description || "",
    key: project?.id || Math.random(),
  }));

  const { mutate: fetchUsers, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        setResponseData(res.projects);
      },
      onError: () => {
        toast.error("Error fetching metrics.");
      },
    }
  );

  useEffect(() => {
    if (currentState?.user?.id) {
      fetchUsers({
        page: 1,
        limit: 3,
        projectType: "present",
        status: "active",
        donor_id: currentState.user.id,
      });
    }
  }, [currentState?.user?.id, fetchUsers]);

  // reset activeIndex if the items change and the index is out of range
  useEffect(() => {
    if (items.length === 0 && activeIndex !== 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  const next = () => {
    if (animating || items.length === 0) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating || items.length === 0) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex: number) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.key}
      >
        <img
          style={{
            width: "100%",
            height: 500,
            objectFit: "cover",
            borderRadius: 8,
          }}
          src={item.src}
          alt={item.altText}
        />
        <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        />
      </CarouselItem>
    );
  });

  return (
    <>
      {isLoading ? (
        <Loading type={"inline"} />
      ) : responseData.length === 0 ? (
        <div>No highlights available.</div>
      ) : null}

      {items.length > 0 && (
        <Carousel
          className="mt-5 mb-5 rounded-xl"
          activeIndex={activeIndex}
          next={next}
          previous={previous}
          {...args}
        >
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
          {slides}
          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={next}
          />
        </Carousel>
      )}
    </>
  );
}
