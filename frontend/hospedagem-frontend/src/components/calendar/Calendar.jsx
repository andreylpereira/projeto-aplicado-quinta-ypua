import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from "date-fns/locale";
import { calendarService } from "./../../services/calendarService";
import "./Calendar.css";


//Componente calendar é utilizado na elaboração do input calendario utilizado nos modals do reservation. É montado com dados como listagem de dias ocupados, com isso fica visivel no calendario na cor vermelha os dias que estão reservados.
const Calendar = ({
  onDateSelect,
  accommodationId,
  selectedDate,
  selectedStartDate,
  selectedEndDate,
}) => {
  const [importantDates, setImportantDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const datePickerRef = useRef(null);

  const handleDateChange = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const loadImportantDates = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const validStartDate = selectedStartDate
      ? new Date(selectedStartDate)
      : null;
    const validEndDate = selectedEndDate ? new Date(selectedEndDate) : null;

    const isValidDate = (date) => !isNaN(new Date(date).getTime());

    const updatedImportantDates = importantDates.filter((item) => {
      const itemDate = new Date(item.data);

      const isInCorrectMonth =
        itemDate.getFullYear() === year && itemDate.getMonth() === month;

      const isNotExcluded =
        (!validStartDate ||
          !isValidDate(validStartDate) ||
          itemDate.getTime() !== validStartDate.getTime()) &&
        (!validEndDate ||
          !isValidDate(validEndDate) ||
          itemDate.getTime() !== validEndDate.getTime());

      return item.ocupado === true && isInCorrectMonth && isNotExcluded;
    });

    return updatedImportantDates.map((item) => new Date(item.data));
  };

  const fetchAgenda = async (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth() + 1;

    try {
      const agendaData = await calendarService(
        accommodationId,
        `${year}-${month < 10 ? "0" + month : month}-01T01:00:00`
      );
      setImportantDates(agendaData);
    } catch (error) {
      console.error("Erro ao buscar agenda:", error);
    }
  };

  useEffect(() => {
    fetchAgenda(currentMonth);
  }, [currentMonth]);

  const handleMonthChange = (date) => {
    setCurrentMonth(date);
  };

  const toggleCalendar = () => {
    setCalendarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={datePickerRef}>
      <DatePicker
        className="form-control"
        selected={selectedDate ? new Date(selectedDate) : null}
        onChange={handleDateChange}
        onMonthChange={handleMonthChange}
        dateFormat="dd/MM/yyyy"
        highlightDates={loadImportantDates(currentMonth)}
        excludeDates={[]}
        inline={calendarOpen}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        onClick={toggleCalendar}
        isClearable
        locale={ptBR}
      />
    </div>
  );
};

export default Calendar;
