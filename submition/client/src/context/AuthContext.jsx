import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext({
  user: null,
  session: null,
  role: null,
  signOut: async () => { },
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (currentUser) => {
    try {
      // 🚨 VIP DEV BYPASS
      if (currentUser?.email === 'ali.ramish1214@gmail.com') {
        console.log('✅ VIP Bypass: Admin access granted!');
        setRole('admin');
        localStorage.setItem('userRole', 'admin');
        return true;
      }

      // 1️⃣ FASTEST: Check user_metadata (saved during signup)
      if (currentUser?.user_metadata?.role) {
        const metadataRole = currentUser.user_metadata.role;
        console.log('⚡ Role from user_metadata:', metadataRole);
        setRole(metadataRole);
        localStorage.setItem('userRole', metadataRole);
        return true;
      }

      // 2️⃣ FAST: Try database with short timeout
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DB timeout after 3000ms')), 3000)
      );
      
      const dbCall = supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      
      const { data, error } = await Promise.race([dbCall, timeout]);

      if (error) throw error;
      
      const fetchedRole = data?.role || 'user';
      console.log('✅ Role fetched from DB:', fetchedRole);
      setRole(fetchedRole);
      localStorage.setItem('userRole', fetchedRole);
      return true;
    } catch (err) {
      console.warn('⚠️ Role fetch failed:', err.message);
      // Always default to 'user' - don't leave UI hanging
      setRole('user');
      localStorage.setItem('userRole', 'user');
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      try {
        // 🎯 INSTANT: Load cached role first for immediate UI render
        const cachedRole = localStorage.getItem('userRole');
        if (cachedRole && isMounted) {
          console.log('⚡ Using cached role:', cachedRole);
          setRole(cachedRole);
        }

        const { data: sessionData } = await supabase.auth.getSession();
        const currentSession = sessionData?.session ?? null;

        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // 🔥 Fetch real role (will update if different from cache)
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user);
        } else {
          setRole(null);
          localStorage.removeItem('userRole');
        }
      } catch (err) {
        console.error('Init session error:', err);
        setRole('user'); // Always set a role so UI doesn't hang
      } finally {
        // ✅ CRUCIAL: Only set loading to false AFTER role check is complete
        if (isMounted) {
          console.log('✅ Auth initialization complete');
          setLoading(false);
        }
      }
    };

    initSession();

    const { data: listenerData } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!isMounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Fetch role in background, use cached value immediately
          const cachedRole = localStorage.getItem('userRole');
          if (cachedRole) {
            setRole(cachedRole);
          }
          await fetchUserRole(currentSession.user);
        } else {
          setRole(null);
          localStorage.removeItem('userRole');
        }
      }
    );

    return () => {
      isMounted = false;
      listenerData?.subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setRole(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontWeight: 'bold', color: '#0d9488' }}>
        Loading Edrugs.pk...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, role, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};