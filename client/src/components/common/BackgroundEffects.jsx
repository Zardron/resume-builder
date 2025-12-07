const BackgroundEffects = () => {
  return (
    <>
      {/* Enhanced animated background effects - Viewport-relative sizing */}
      <div 
        className="fixed -top-20 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-purple-500/20 blur-[120px] md:blur-[180px] lg:blur-[240px] dark:from-blue-500/10 dark:via-cyan-500/8 dark:to-purple-500/10 animate-pulse pointer-events-none z-0"
        style={{
          width: 'clamp(300px, min(90vw, 700px), 700px)',
          height: 'clamp(300px, min(50vh, 500px), 500px)',
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      />
      <div 
        className="fixed top-40 right-4 md:right-10 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-[100px] md:blur-[150px] lg:blur-[200px] dark:from-cyan-500/5 dark:to-blue-500/5 pointer-events-none z-0"
        style={{
          width: 'clamp(160px, min(30vw, 320px), 320px)',
          height: 'clamp(160px, min(30vw, 320px), 320px)',
          maxWidth: 'calc(100vw - 2rem)',
          maxHeight: '100vh'
        }}
      />
      <div 
        className="fixed bottom-20 left-4 md:left-10 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-[90px] md:blur-[140px] lg:blur-[180px] dark:from-purple-500/5 dark:to-pink-500/5 pointer-events-none z-0"
        style={{
          width: 'clamp(140px, min(25vw, 256px), 256px)',
          height: 'clamp(140px, min(25vw, 256px), 256px)',
          maxWidth: 'calc(100vw - 2rem)',
          maxHeight: '100vh'
        }}
      />
    </>
  );
};

export default BackgroundEffects;

