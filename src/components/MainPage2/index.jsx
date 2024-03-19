import {
  useCallback,
  useEffect,
  // useLayoutEffect,
  useMemo,
  // useMemo,
  useRef,
  useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/pokedex_logo.png";
import { useGetItemsQuery } from "../../store/api";

const itemHeight = 40;
const containerHeight = 700;
// const overscan = 3;

const threshold = 700;

export const MainPage = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [, setIsScrolling] = useState(false);
  const [fullData, setFullData] = useState([]);

  console.log("fullData--->>>", fullData);

  const limit= useMemo(()=> 20,[]); // в константу
  const [offset, setOffset] = useState(0);

  const scrollElementRef = useRef(null);

  const navigate = useNavigate();
  const { data = null, isFetching } = useGetItemsQuery({ limit, offset }); // приходит только имя и ссылка



  useEffect(() => {
    if (data?.results?.length > 0) {
      setFullData((prev) => [...prev, ...data.results]);
    }
  }, [data?.results]);


useEffect(() => {
  const scrollElement = scrollElementRef.current;

  if (!scrollElement) {
    return;
  }

  const handleScroll = () => {
    const scrollTop = scrollElement.scrollTop;
    setScrollTop(scrollTop);
  };

  // handleScroll()

  scrollElement.addEventListener("scroll", handleScroll);

  return () => {
    scrollElement.removeEventListener("scroll", handleScroll);
  };
}, []);


const clickHandler = useCallback(
  (id) => {
    navigate(`/pokemon/${id}`);
  },
  [navigate]
);



 const pokemonsToRender = useMemo(() => {
   const rangeEnd = scrollTop + containerHeight;

   let startIndex = Math.floor(scrollTop / itemHeight);
   let endIndex = Math.ceil(rangeEnd / itemHeight);

   startIndex = Math.max(0, startIndex);
   endIndex = Math.min(fullData.length - 1, endIndex);

   const pokemons = [];

   for (let index = startIndex; index <= endIndex; index++) {
     pokemons.push({
       index,
       offsetTop: index * itemHeight,
     });
   }

   return pokemons;
 }, [scrollTop, fullData.length]);


  console.log("pokemonsToRender==>>>", pokemonsToRender);

  const onScroll = useCallback((e)=> {
    // alert('asd')
    console.log("e.target.clientHeight--->", e.target.clientHeight);
    console.log("e.target.scrollTop--->", e.target.scrollTop);

      if (
       e.target.clientHeight + e.target.scrollTop >=
       e.target.scrollHeight - threshold
     ) {
       setIsScrolling(false);
       setOffset((prevOffset) => prevOffset + limit);
     }

  },[limit])

  return (
    <>
      <div>
        <Link to="/">
          <img alt="home" src={logo} title="home" />
        </Link>
      </div>
      {/* <h1>ПОКЕМОНЫ ЕПТА</h1> */}
      <div
        ref={scrollElementRef}
        style={{
          border: "3px solid red",
          height: containerHeight,
          overflowY: "scroll",
          position: "relative",
        }}
        onScroll={(e) => onScroll(e)}
      >
        <div>
          {pokemonsToRender?.map((el) => {
            // console.log("el", el);
            const pokemon = fullData[el.index];
            // console.log("pokemon--->>>", pokemon);
            return (
              <div
                key={pokemon.name}
                style={{
                  backgroundColor: "white",
                  border: "1px solid blue",
                  boxSizing: "border-box",
                  color: "red",
                  height: itemHeight,
                  top: 0,
                  transform: `translateY(${el.offsetTop})px`,
                }}
                onClick={() => {
                  clickHandler(pokemon.name);
                }}
              >
                <div>{pokemon.name}</div>
                {/* <img alt={`${pokemon.name}`} src={pokemon.url} /> */}
              </div>
            );
          })}
        </div>
        {isFetching && <div>Loading...</div>}
      </div>
    </>
  );
};

export default MainPage;