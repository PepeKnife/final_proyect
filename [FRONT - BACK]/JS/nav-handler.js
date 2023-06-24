function nav_handler() {
  //NAV LISTENERS AND FUNCTIONALITY
  //nav-btns
  const abt_btn = document.getElementById("about-me-btn");
  const paints_btn = document.getElementById("paints-btn");
  const writings_btn = document.getElementById("writings-btn");
  //indicators
  const abt_indi_1 = document.getElementById("abt-indi-1");
  const abt_indi_2 = document.getElementById("abt-indi-2");
  const paint_indi_1 = document.getElementById("paint-indi-1");
  const paint_indi_2 = document.getElementById("paint-indi-2");
  const writings_indi_1 = document.getElementById("writings-indi-1");
  const writings_indi_2 = document.getElementById("writings-indi-2");
  //sections
  const abt_sect = document.getElementById("about-me-section");
  const paints_sect = document.getElementById("paintings");
  const writings_sect = document.getElementById("writings");

  //FUNCTIONALITY
  //by default only abt displayed
  abt_indi_1.style.backgroundColor = "#321B44";
  abt_indi_2.style.backgroundColor = "#321B44";

  paint_indi_1.style.backgroundColor = "#161224";
  paint_indi_2.style.backgroundColor = "#161224";

  writings_indi_1.style.backgroundColor = "#161224";
  writings_indi_2.style.backgroundColor = "#161224";

  abt_sect.style.display = "block";
  paints_sect.style.display = "none";
  writings_sect.style.display = "none";

  abt_btn.addEventListener("click", () => {
    abt_indi_1.style.backgroundColor = "#321B44";
    abt_indi_2.style.backgroundColor = "#321B44";

    paint_indi_1.style.backgroundColor = "#161224";
    paint_indi_2.style.backgroundColor = "#161224";

    writings_indi_1.style.backgroundColor = "#161224";
    writings_indi_2.style.backgroundColor = "#161224";

    abt_sect.style.display = "block";
    paints_sect.style.display = "none";
    writings_sect.style.display = "none";
  });
  paints_btn.addEventListener("click", () => {
    abt_indi_1.style.backgroundColor = "#161224";
    abt_indi_2.style.backgroundColor = "#161224";

    paint_indi_1.style.backgroundColor = "#321B44";
    paint_indi_2.style.backgroundColor = "#321B44";

    writings_indi_1.style.backgroundColor = "#161224";
    writings_indi_2.style.backgroundColor = "#161224";

    abt_sect.style.display = "none";
    paints_sect.style.display = "block";
    writings_sect.style.display = "none";
  });
  writings_btn.addEventListener("click", () => {
    abt_indi_1.style.backgroundColor = "#161224";
    abt_indi_2.style.backgroundColor = "#161224";

    paint_indi_1.style.backgroundColor = "#161224";
    paint_indi_2.style.backgroundColor = "#161224";

    writings_indi_1.style.backgroundColor = "#321B44";
    writings_indi_2.style.backgroundColor = "#321B44";

    abt_sect.style.display = "none";
    paints_sect.style.display = "none";
    writings_sect.style.display = "block";
  });
}

export { nav_handler };
