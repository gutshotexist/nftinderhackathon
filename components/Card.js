import React from "react";
import { motion } from "framer-motion";

const Card = (props) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [animationDirection, setAnimationDirection] = React.useState(null);
  const [liked, setLiked] = React.useState(false);

  const handleNopeClick = () => {
    setIsAnimating(true);
    setAnimationDirection("left");
    setTimeout(() => {
      props.onNopeClick();
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 500);
  };

  const handleLikeClick = () => {
    setIsAnimating(true);
    setAnimationDirection("right");
    setLiked(!liked);

    setTimeout(() => {
      props.onLikeClick();
      setIsAnimating(false);
      setAnimationDirection(null);
    }, 500);
  };

  const handlePrevClick = () => {
    props.onPrevClick();
  };

  const handleFavoriteClick = () => {
    const index = props.favorites.findIndex(
      (favorite) => favorite.name === props.collection.name
    );

    if (index > -1) {
      props.setFavorites((prevFavorites) => {
        const newFavorites = [...prevFavorites];
        newFavorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        console.log("Favorites:", newFavorites);
        return newFavorites;
      });
    } else {
      props.setFavorites((prevFavorites) => {
        const newFavorites = [...prevFavorites, props.collection];
        localStorage.setItem("favorites", JSON.stringify(newFavorites));
        console.log("Favorites:", newFavorites);
        return newFavorites;
      });
    }
  };

  const cardVariants = {
    hidden: { x: -500, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    left: { x: -500, opacity: 0, transition: { duration: 0.5 } },
    right: { x: 500, opacity: 0, transition: { duration: 0.5 } },
  };

  const imageSrc = Array.isArray(props.image) ? props.image[0] : props.image;

  return (
    <motion.div
      className={`relative flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden w-350 h-350 mt-50`}
      variants={cardVariants}
      animate={
        isAnimating && animationDirection === "left"
          ? "left"
          : isAnimating && animationDirection === "right"
          ? "right"
          : "visible"
      }
      onAnimationComplete={() => setAnimationDirection(null)}
    >
      <motion.img
        className="w-full h-2/3 object-cover rounded-t-3xl"
        src={imageSrc}
        alt={props.name}
        initial={{ scale: 0 }}
        animate={{ scale: 1, transition: { delay: 0.25, duration: 0.5 } }}
        exit={{ scale: 0, transition: { duration: 0.5 } }}
      />

      <div className="flex flex-col justify-between flex-1 p-6">
        <div className="flex flex-col">
          <h2 className="text-gray-900 font-medium text-lg">
            {props.name} — {props.price}
          </h2>

          <div className="flex flex-wrap items-center mt-2">
            <div className="text-gray-700 font-medium">{props.volume}</div>
            <div className="mx-2">|</div>
            <div className="text-gray-700 underline">
              {props.collectionName}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <motion.button
            id="prev-button"
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300 ease-in-out"
            onClick={handlePrevClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            &#8634; Previous
          </motion.button>

          <motion.button
            id="hate-button"
            className="px-4 py-2 text-gray-800 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300 ease-in-out"
            onClick={handleNopeClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🚫 Nope
          </motion.button>

          <motion.button
            id="favorite-button"
            className={`px-4 py-2 text-gray-800 ${
              props.favorites.some(
                (favorite) => favorite.name === props.collection.name
              )
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-200 hover:bg-gray-300"
            } rounded-full transition-colors duration-300 ease-in-out`}
            onClick={handleFavoriteClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span style={{ fontSize: "1.5em" }}>
              {props.favorites.some(
                (favorite) => favorite.name === props.collection.name
              )
                ? "★ "
                : "☆ "}
            </span>
          </motion.button>

          <motion.button
            id="love-button"
            className="px-4 py-2 text-white bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300 ease-in-out"
            onClick={handleLikeClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span
              style={{ fontSize: "1.5em", color: liked ? "black" : "black" }}
            >
              {liked ? "\u2665" : "\u2661"}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
