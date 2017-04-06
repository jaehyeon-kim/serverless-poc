import unittest
import handler

class AdmitHandlerTest(unittest.TestCase):
    def test_admit(self):
        gre = '800'
        gpa = '4'
        ranks = {'1': True, '4': False}
        for rnk in ranks.keys():
            self.assertEqual(handler.pred_admit(gre, gpa, rnk), ranks.get(rnk))

if __name__ == "__main__":
    unittest.main()

        
