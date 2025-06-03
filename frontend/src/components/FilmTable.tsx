import { useEffect, useState } from 'react';
import api from '../services/api';

/* pola, które pokazujemy w tabeli */
interface Film {
  id: number;
  title: string;
  year: number;
  runtime: number | null;
  /* jeśli chcesz kraj / języki dopisz:
     country: string[];
     languages: string[];
  */
}

export default function FilmTable() {
  const [films, setFilms]   = useState<Film[]>([]);
  const [loading, setLoad ] = useState(false);
  const [error,   setErr  ] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      setLoad(true);
      try {
        // baseURL = '/api', wystarczy '/films/'
        const res = await api.get('/films/');

        // obsługa paginacji DRF
        const list: Film[] = Array.isArray(res.data)
          ? res.data
          : res.data.results ?? [];

        setFilms(list);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Błąd');
      } finally {
        setLoad(false);
      }
    };

    fetchFilms();
  }, []);

  /* --- render --- */
  if (loading)  return <p>Ładowanie…</p>;
  if (error)    return <p style={{ color: 'red' }}>Błąd: {error}</p>;
  if (!films.length) return <p>Brak danych.</p>;

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={th}>ID</th>
          <th style={th}>Tytuł</th>
          <th style={th}>Rok</th>
          <th style={th}>Czas&nbsp;(min)</th>
        </tr>
      </thead>
      <tbody>
        {films.map(f => (
          <tr key={f.id}>
            <td style={td}>{f.id}</td>
            <td style={td}>{f.title}</td>
            <td style={td}>{f.year}</td>
            <td style={td}>{f.runtime ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* drobne style inline */
const th = { border: '1px solid #333', padding: '6px', background: '#f2f2f2' };
const td = { border: '1px solid #333', padding: '6px' };
