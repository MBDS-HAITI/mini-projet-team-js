export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  // Données fictives pour la démonstration
  const stats = [
    {
      title: 'Total Étudiants',
      value: '1,247',
      icon: <People />,
      color: '#667eea',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Cours Actifs',
      value: '89',
      icon: <Book />,
      color: '#764ba2',
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'Enseignants',
      value: '34',
      icon: <School />,
      color: '#f093fb',
      change: '+2%',
      changeType: 'positive',
    },
    {
      title: 'Notes Saisies',
      value: '2,847',
      icon: <Assessment />,
      color: '#4facfe',
      change: '+18%',
      changeType: 'positive',
    },
  ];

  const recentActivities = [
    { action: 'Nouvel étudiant inscrit', time: 'Il y a 2h', user: 'Alice Dupont' },
    { action: 'Cours ajouté', time: 'Il y a 4h', user: 'Mathématiques Avancées' },
    { action: 'Note modifiée', time: 'Il y a 6h', user: 'Jean Martin - Physique' },
    { action: 'Rapport généré', time: 'Il y a 1j', user: 'Bulletin Trimestriel' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: '#2c3e50' }}>
                Dashboard Administrateur
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#7f8c8d', mt: 1 }}>
                Bienvenue, {user?.name || 'Administrateur'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={<CalendarToday />}
                label={new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                sx={{ bgcolor: 'white', color: '#2c3e50' }}
              />
              <Avatar sx={{ bgcolor: '#667eea', width: 48, height: 48 }}>
                <AccountCircle />
              </Avatar>
            </Box>
          </Box>
          <Divider sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: 'white',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100px',
                    background: `radial-gradient(circle, ${stat.color}20 0%, transparent 70%)`,
                    borderRadius: '50%',
                    transform: 'translate(30px, -30px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: 48,
                        height: 48,
                        boxShadow: `0 4px 12px ${stat.color}40`,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        bgcolor: stat.changeType === 'positive' ? '#e8f5e8' : '#ffebee',
                        color: stat.changeType === 'positive' ? '#2e7d32' : '#c62828',
                        fontWeight: 600,
                      }}
                      icon={<TrendingUp sx={{ fontSize: 14 }} />}
                    />
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Recent Activities */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                height: '100%',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                Activités Récentes
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivities.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(102, 126, 234, 0.04)',
                      border: '1px solid rgba(102, 126, 234, 0.08)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32, mr: 2 }}>
                      <Notifications sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                        {activity.user}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#95a5a6' }}>
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions & System Status */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* System Status */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                  État du Système
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                        Utilisation CPU
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                        45%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={45} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                        Mémoire
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                        67%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={67} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                        Stockage
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                        23%
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={23} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                </Box>
              </Paper>

              {/* Quick Actions */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                  Actions Rapides
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    { label: 'Ajouter un étudiant', color: '#667eea' },
                    { label: 'Créer un cours', color: '#764ba2' },
                    { label: 'Générer un rapport', color: '#f093fb' },
                    { label: 'Paramètres système', color: '#4facfe' },
                  ].map((action, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: `${action.color}15`,
                        border: `1px solid ${action.color}30`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: `${action.color}25`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${action.color}20`,
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                        {action.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
