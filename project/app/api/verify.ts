// import { supabase } from '@/lib/supabase';
// import { router } from 'expo-router';

// export async function verifySession() {
//   try {
//     const { data: { session }, error } = await supabase.auth.getSession();
    
//     if (error) throw error;
    
//     if (!session) {
//       router.replace('/(auth)/login');
//       return null;
//     }

//     // Verify the JWT by making a request to get user profile
//     const { data: profile, error: profileError } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', session.user.id)
//       .single();

//     if (profileError) throw profileError;

//     return {
//       session,
//       profile,
//       jwt: session.access_token,
//     };
//   } catch (error) {
//     console.error('Error verifying session:', error);
//     router.replace('/(auth)/login');
//     return null;
//   }
// }

// export default verifySession;