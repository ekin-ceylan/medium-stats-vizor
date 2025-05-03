export default function Result() {
    this.MemberViews = 0;
    this.MemberReads = 0;
    this.NonMemberViews = 0;
    this.NonMemberReads = 0;
    this.YesterdayMemberReads = 0;
    this.YesterdayEarnings = 0;

    Object.defineProperty(this, 'AllViews', { get: () => this.MemberViews + this.NonMemberViews });
    Object.defineProperty(this, 'AllReads', { get: () => this.MemberReads + this.NonMemberReads });
    Object.defineProperty(this, 'TxtEarns', { get: () => `$${(0.01 * this.YesterdayEarnings).toFixed(2)}` });
}
