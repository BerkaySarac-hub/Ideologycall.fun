function checkIdeology(ideology) {
    return function(req, res, next) {
      const userIdeology = req.user.ideology; // Varsayılan olarak kullanıcının ideolojisi
      if (userIdeology !== ideology) {
        return res.status(401).send('Bu sayfaya erişim izniniz yok.'); // Erişim reddedildi
      }
      next(); // Devam et
    }
}