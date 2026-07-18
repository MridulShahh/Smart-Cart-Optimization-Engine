import { useState, useEffect } from 'react';
import api from '../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading };
};

export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands');
        setBrands(res.data || []);
      } catch (err) {
        console.error('Failed to fetch brands', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return { brands, loading };
};

export const useHomepage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get('/homepage');
        setSections(res.data || []);
      } catch (err) {
        console.error('Failed to fetch homepage sections', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  return { sections, loading };
};
